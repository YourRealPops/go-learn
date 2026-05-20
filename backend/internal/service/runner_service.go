package service

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
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
		return nil, errors.New("runner unavailable")
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var playgroundResp struct {
		Errors string `json:"Errors"`
		Events []struct {
			Message string `json:"Message"`
			Kind    string `json:"Kind"`
		} `json:"Events"`
	}

	if err := json.Unmarshal(body, &playgroundResp); err != nil {
		// Try plain text response as fallback
		output := strings.TrimSpace(string(body))
		if output == "" {
			output = "(no output)"
		}
		return &RunResult{Output: output, IsError: false}, nil
	}

	if playgroundResp.Errors != "" {
		return &RunResult{Output: playgroundResp.Errors, IsError: true}, nil
	}

	var sb strings.Builder
	for _, e := range playgroundResp.Events {
		sb.WriteString(e.Message)
	}

	output := sb.String()
	if output == "" {
		output = "(no output)"
	}

	return &RunResult{Output: output, IsError: false}, nil
}