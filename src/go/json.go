package main

import (
	"encoding/json"
	"log"
	"net/http"
)

/*
Handles an HTTP Response by sending a JSON-encoded payload with the specified status code.

Parameters:

	w: Response writer used to send the HTTP response.
	code: Status code to be included in the HTTP response.
	payload: The data to be marshaled into JSON format and sent as the response body.
*/
func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	data, err := json.Marshal(payload) // Convert the payload to JSON format (bytes)

	if err != nil {
		log.Printf("Failed to marshal JSON response: %v", err)
		w.WriteHeader(http.StatusInternalServerError) // Set the response status code to 500 Internal Server Error
		return
	}

	w.Header().Set("Content-Type", "application/json") // Set the response header to indicate that the response body is in JSON format
	w.WriteHeader(code)                                // Set the HTTP response status code to the specified code
	w.Write(data)                                      // Write the JSON data as the response body
}

/*
Handles errors by sending an error response in JSON format with the specified status code and message.

Parameters:

	w: Response writer used to send the HTTP response.
	code: Status code to be included in the HTTP response.
	message: The error message to be included in the response.
*/
func respondWithError(w http.ResponseWriter, code int, message string) {
	// Log internal server errors
	if code > 499 {
		log.Println("Responding with 500 Level ERROR:", message)
	}

	// Define a custom error_response type to structure the JSON response
	type errorResponse struct {
		Error string `json:"error"`
	}

	// Create an instance of the errorResponse struct with the given error message
	errorObj := errorResponse{Error: message}

	// Pass the error object to the respondWithJSON function to send the JSON response
	respondWithJSON(w, code, errorObj)
}
