package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/cors"
	_ "github.com/lib/pq"
)

func SelectionDatabase[T comparable](database *sql.DB, col, table T) T {
	var element T
	formatted_value := fmt.Sprintf("SELECT %s FROM %s", col, table)

	err := database.QueryRow(formatted_value).Scan(&element)
	if err != nil {
		log.Fatal(err)
	}

	return element
}

func main() {
	// Connection string
	connection_str := "host=localhost port=5432 user=postgres password=u;09]KSa6#HnMb3# dbname=ieacoldbrew sslmode=disable"

	// Open the connection
	database_iea, err := sql.Open("postgres", connection_str)
	if err != nil {
		log.Fatal(err)
	}
	defer database_iea.Close()

	mux := http.NewServeMux()

	mux.HandleFunc("/api/product/price", func(w http.ResponseWriter, r *http.Request) {
		price := SelectionDatabase(database_iea, "name", "product")

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"price": price,
		})
	})

	// Create a new CORS handler
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"}, // Allow your Vite server origin
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	// Wrap the mux with the CORS handler
	handler := c.Handler(mux)

	fmt.Println("Server is running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
