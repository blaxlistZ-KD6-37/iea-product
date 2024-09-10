package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type db_handler_st struct {
	DB *sql.DB
}

func main() {
	// Loading the environment variables from the .env file
	godotenv.Load(".env")

	// Getting the port address from the environment variables
	port_str := os.Getenv("PORT")
	if port_str == "" {
		log.Fatal("PORT unavailable")
	}

	// Getting the database from the environment variables
	database_url := os.Getenv("DB_URL")
	if database_url == "" {
		log.Fatal("DB_URL is unavailable")
	}

	iea_connection, err := sql.Open("postgres", database_url)
	if err != nil {
		log.Fatal(err)
	}

	defer iea_connection.Close()

	if err = iea_connection.Ping(); err != nil {
		log.Fatal(err)
	}

	database_handler := newHandler(iea_connection)

	// Creating a new router object using Chi
	router := chi.NewRouter()

	// Configuring CORS settings for the router to allow requests from specified origins and methods
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	// Creating a new router for handling "/A1_" paths
	A1_rtr := chi.NewRouter()

	// Registering the "/err" path with the handlerError function
	A1_rtr.Get("/err", handlerError)

	// Registering the "/runlive" path with the handlerReady function
	A1_rtr.Get("/runlive", handlerReady)

	A1_rtr.Get("/runlive/account", database_handler.handlerAccount)
	A1_rtr.Get("/runlive/transaction", database_handler.handlerTransaction)
	A1_rtr.Get("/runlive/transaction_detail", database_handler.handlerTransactionDetail)
	A1_rtr.Get("/runlive/financial_account", database_handler.handlerFinancialAccounts)

	// Mounting the A1_rtr router under the "/A1_" path prefix
	router.Mount("/A1_", A1_rtr)

	// Creating an HTTP server with the specified router and port
	server := &http.Server{
		Handler: router,
		Addr:    ":" + port_str, // Example: ":8080"
	}

	log.Printf("Server starting on port: %s", port_str)

	// Starting the HTTP server and handling incoming requests
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
