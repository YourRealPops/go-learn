package service

import (
	"encoding/json"
	"errors"
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

// Run executes Go code and returns the output.
// Currently proxies to the Go Playground — swap body for Docker sandbox later.
func (s *RunnerService) Run(code string) (*RunResult, error) {
	if strings.TrimSpace(code) == "" {
		return nil, errors.New("no code provided")
	}

	resp, err := s.client.PostForm("https://play.golang.org/run", url.Values{
		"version": {"2"},
		"body":    {code},
	})
	if err != nil {
		return nil, errors.New("runner unavailable")
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// Go Playground response shape
	var playgroundResp struct {
		Errors string `json:"Errors"`
		Events []struct {
			Message string `json:"Message"`
			Kind    string `json:"Kind"`
		} `json:"Events"`
	}

	if err := json.Unmarshal(body, &playgroundResp); err != nil {
		return nil, errors.New("invalid response from runner")
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