package service

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type RunnerService struct {
	client *http.Client
}

type RunResult struct {
	Output  string `json:"output"`
	IsError bool   `json:"isError"`
}

func NewRunnerService() *RunnerService {
	return &RunnerService{
		client: &http.Client{Timeout: 15 * time.Second},
	}
}

func (s *RunnerService) Run(code string) (*RunResult, error) {
	if strings.TrimSpace(code) == "" {
		return nil, errors.New("no code provided")
	}

	// Try go.dev playground format
	result, err := s.runGoDev(code)
	if err == nil {
		return result, nil
	}

	// Fall back to play.golang.org format
	return s.runPlayground(code)
}

// runGoDev uses the go.dev/play compile endpoint
func (s *RunnerService) runGoDiv(code string) (*RunResult, error) {
	formData := url.Values{
		"version": {"2"},
		"body":    {code},
		"withVet": {"true"},
	}

	resp, err := s.client.PostForm("https://go.dev/_/compile", formData)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result struct {
		Errors string `json:"Errors"`
		Events []struct {
			Message string `json:"Message"`
			Kind    string `json:"Kind"`
			Delay   int    `json:"Delay"`
		} `json:"Events"`
		VetErrors string `json:"VetErrors"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	if result.Errors != "" {
		return &RunResult{Output: result.Errors, IsError: true}, nil
	}

	if result.VetErrors != "" {
		return &RunResult{Output: result.VetErrors, IsError: true}, nil
	}

	var sb strings.Builder
	for _, e := range result.Events {
		sb.WriteString(e.Message)
	}

	output := sb.String()
	if output == "" {
		output = "(no output)"
	}

	return &RunResult{Output: output, IsError: false}, nil
}

// runPlayground uses the play.golang.org endpoint
func (s *RunnerService) runPlayground(code string) (*RunResult, error) {
	payload, _ := json.Marshal(map[string]string{
		"version": "2",
		"body":    code,
	})

	resp, err := s.client.Post(
		"https://play.golang.org/run",
		"application/json",
		bytes.NewReader(payload),
	)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result struct {
		Errors string `json:"Errors"`
		Events []struct {
			Message string `json:"Message"`
			Kind    string `json:"Kind"`
		} `json:"Events"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		output := strings.TrimSpace(string(body))
		if output == "" {
			output = "(no output)"
		}
		return &RunResult{Output: output, IsError: false}, nil
	}

	if result.Errors != "" {
		return &RunResult{Output: result.Errors, IsError: true}, nil
	}

	var sb strings.Builder
	for _, e := range result.Events {
		sb.WriteString(e.Message)
	}

	output := sb.String()
	if output == "" {
		output = "(no output)"
	}

	return &RunResult{Output: output, IsError: false}, nil
}

// runGoDev is the exported version
func (s *RunnerService) runGoDev(code string) (*RunResult, error) {
	return s.runGoDiv(code)
}