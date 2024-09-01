package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
)

func (dat *db_handler_st) handlerProductName(w http.ResponseWriter, r *http.Request) {
	name := dat.SelectionDatabase("name", "product")

	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"name": name,
	})
}

func (dat *db_handler_st) SelectionDatabase(col, table string) string {
	var element string
	formatted_value := fmt.Sprintf("SELECT %s FROM %s", col, table)

	err := dat.DB.QueryRow(formatted_value).Scan(&element)
	if err != nil {
		log.Printf("Error in SelectionDatabase: %v", err)
	}

	return element
}

func newHandler(dat *sql.DB) *db_handler_st {
	return &db_handler_st{DB: dat}
}
