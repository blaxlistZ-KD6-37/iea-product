package main

import "net/http"

/*
Defines an HTTP handler function that conforms to the way the GO standard library expects.

Parameters:
  w: Response writer used to send the HTTP response.
  r: Pointer to the incoming HTTP request.
*/
func handlerError(w http.ResponseWriter, r *http.Request) {
	// Respond with an error message and a status code of 400 (Bad Request)
	respondWithError(w, 400, "SOMETHING WENT WRONG")
}
