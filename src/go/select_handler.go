package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
)

func (dat *db_handler_st) handlerAccount(w http.ResponseWriter, r *http.Request) {
	account_id, name, category :=
		dat.selectionDatabase("account_id", "account"),
		dat.selectionDatabase("name", "account"),
		dat.selectionDatabase("category", "account")

	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"account_id":       account_id,
		"account_name":     name,
		"account_category": category,
	})
}

func (dat *db_handler_st) handlerTransaction(w http.ResponseWriter, r *http.Request) {
	transaction_id, date, description :=
		dat.selectionDatabase("transaction_id", "transaction_tab"),
		dat.selectionDatabase("date", "transaction_tab"),
		dat.selectionDatabase("description", "transaction_tab")

	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"transaction_id":          transaction_id,
		"transaction_date":        date,
		"transaction_description": description,
	})
}

func (dat *db_handler_st) handlerTransactionDetail(w http.ResponseWriter, r *http.Request) {
	transaction_detail_id, transaction_id, account_id, amount, is_debit :=
		dat.selectionDatabase("transaction_detail_id", "transaction_detail"),
		dat.selectionDatabase("transaction_id", "transaction_detail"),
		dat.selectionDatabase("account_id", "transaction_detail"),
		dat.selectionDatabase("amount", "transaction_detail"),
		dat.selectionDatabase("is_debit", "transaction_detail")

	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"transaction_detail_id": transaction_detail_id,
		"transaction_id_fk":     transaction_id,
		"account_id_fk":         account_id,
		"transaction_amount":    amount,
		"transaction_is_debit":  is_debit,
	})
}

func (dat *db_handler_st) selectionDatabase(col, table string) []string {
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
