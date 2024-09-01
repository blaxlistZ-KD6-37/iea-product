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

func (dat *db_handler_st) SelectionDatabase(col, table string) []string {
	var elements []string
	formatted_value := fmt.Sprintf("SELECT %s FROM %s", col, table)

	rows, err := dat.DB.Query(formatted_value)
	if err != nil {
		log.Printf("Error in SelectionDatabase: %v", err)
		return elements
	}
	defer rows.Close()

	for rows.Next() {
		var element string
		err := rows.Scan(&element)
		if err != nil {
			log.Printf("Error scanning row in SelectionDatabase: %v", err)
			continue
		}
		elements = append(elements, element)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating rows in SelectionDatabase: %v", err)
	}

	return elements
}

func newHandler(dat *sql.DB) *db_handler_st {
	return &db_handler_st{DB: dat}
}
