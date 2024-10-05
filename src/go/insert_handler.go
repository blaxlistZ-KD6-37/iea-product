package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

type TransactionTab struct {
	TransactionTabID int    `json:"transaction_tab_id"`
	Date             string `json:"date"`
	Description      string `json:"description"`
}

type TransactionDetail struct {
	TransactionDetailID int     `json:"transaction_detail_id"`
	TransactionTabID    int     `json:"transaction_tab_id"`
	AccountID           int     `json:"account_id"`
	Amount              float64 `json:"amount"`
	IsDebit             bool    `json:"is_debit"`
}

func (dat *db_handler_st) handlerPostTransaction(w http.ResponseWriter, r *http.Request) {
	var transTab TransactionTab
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&transTab); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	defer r.Body.Close()

	columns := []string{
		"transaction_tab_id",
		"date",
		"description",
	}

	values := []string{
		fmt.Sprintf("'%s'", transTab.Date),
		fmt.Sprintf("'%s'", transTab.Description),
	}

	table_name := strings.Trim(columns[0], "_id")
	columns = columns[1:]

	transaction_result, err := dat.insertionDatabase(table_name, columns, values)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error retrieving %v from the database: %v", table_name, err), http.StatusInternalServerError)
		return
	}

	response_data := make([]map[string]interface{}, len(transaction_result))
	for i, row := range transaction_result {
		response_data[i] = map[string]interface{}{
			columns[0]: row[columns[0]],
			columns[1]: row[columns[1]],
		}
	}

	respondWithJSON(w, http.StatusOK, response_data)
}

func (dat *db_handler_st) handlerPostTransactionDetail(w http.ResponseWriter, r *http.Request) {
	var transDetail TransactionDetail
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&transDetail); err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}
	defer r.Body.Close()

	columns := []string{
		"transaction_detail_id",
		"transaction_tab_id",
		"account_id",
		"amount",
		"is_debit",
	}

	debit_values := []string{
		fmt.Sprintf("%d", transDetail.TransactionTabID),
		fmt.Sprintf("%d", transDetail.AccountID),
		fmt.Sprintf("%f", transDetail.Amount),
		fmt.Sprintf("%t", transDetail.IsDebit),
	}

	// Insert both transactions
	table_name := strings.Trim(columns[0], "_id")
	columns = columns[1:]

	// Insert debit transaction
	debit_result, err := dat.insertionDatabase(table_name, columns, debit_values)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error inserting detail transaction: %v", err))
		return
	}

	// Combine results
	response_data := make([]map[string]interface{}, len(debit_result))
	for i, row := range debit_result {
		response_data[i] = map[string]interface{}{
			columns[0]: row[columns[0]],
			columns[1]: row[columns[1]],
			columns[2]: row[columns[2]],
			columns[3]: row[columns[3]],
		}
	}

	respondWithJSON(w, http.StatusOK, response_data)
}

func (dat *db_handler_st) insertionDatabase(table string, cols, vals []string) ([]map[string]interface{}, error) {
	values, columns := strings.Join(vals, ", "), strings.Join(cols, ", ")
	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s) RETURNING %s", table, columns, values, table+"_id")

	rows, err := dat.DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error querying database: %v", err)
	}
	defer rows.Close()

	column_names, err := rows.Columns()
	if err != nil {
		return nil, fmt.Errorf("error getting column names: %v", err)
	}

	var elements []map[string]interface{}
	for rows.Next() {
		element, err := scanRow(rows, column_names)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}
		elements = append(elements, element)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %v", err)
	}

	return elements, nil
}
