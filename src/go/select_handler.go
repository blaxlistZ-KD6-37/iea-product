package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func (dat *db_handler_st) handlerAccount(w http.ResponseWriter, r *http.Request) {
	columns := []string{
		"account_id",
		"name",
		"category",
	}
	table_name := strings.Trim(columns[0], "_id")
	transaction_result, err := dat.selectionDatabase(table_name, columns[0], columns...)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error retrieving %v from the database: %v", table_name, err), http.StatusInternalServerError)
		return
	}

	response_data := make([]map[string]interface{}, len(transaction_result))
	for i, row := range transaction_result {
		response_data[i] = map[string]interface{}{
			columns[0]: row[columns[0]],
			columns[1]: row[columns[1]],
			columns[2]: row[columns[2]],
		}
	}

	respondWithJSON(w, http.StatusOK, response_data)
}

func (dat *db_handler_st) handlerTransaction(w http.ResponseWriter, r *http.Request) {
	columns := []string{
		"transaction_tab_id",
		"date",
		"description",
	}
	table_name := strings.Trim(columns[0], "_id")
	transaction_result, err := dat.selectionDatabase(table_name, columns[0], columns...)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error retrieving %v from the database: %v", table_name, err), http.StatusInternalServerError)
		return
	}

	response_data := make([]map[string]interface{}, len(transaction_result))
	for i, row := range transaction_result {
		response_data[i] = map[string]interface{}{
			columns[0]: row[columns[0]],
			columns[1]: row[columns[1]],
			columns[2]: row[columns[2]],
		}
	}

	respondWithJSON(w, http.StatusOK, response_data)
}

func (dat *db_handler_st) handlerTransactionDetail(w http.ResponseWriter, r *http.Request) {
	columns := []string{
		"transaction_detail_id",
		"transaction_tab_id",
		"account_id",
		"amount",
		"is_debit",
	}
	table_name := strings.Trim(columns[0], "_id")
	transaction_detail_result, err := dat.selectionDatabase(table_name, columns[0], columns...)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error retrieving %v from the database: %v", table_name, err), http.StatusInternalServerError)
		return
	}

	response_data := make([]map[string]interface{}, len(transaction_detail_result))
	for i, row := range transaction_detail_result {
		response_data[i] = map[string]interface{}{
			columns[0]: row[columns[0]],
			columns[1]: row[columns[1]],
			columns[2]: row[columns[2]],
			columns[3]: row[columns[3]],
			columns[4]: row[columns[4]],
		}
	}

	respondWithJSON(w, http.StatusOK, response_data)
}

func (dat *db_handler_st) selectionDatabase(table, pivot string, cols ...string) ([]map[string]interface{}, error) {
	columns := strings.Join(cols, ", ")
	query := fmt.Sprintf("SELECT %s FROM %s ORDER BY %s ASC", columns, table, pivot)

	rows, err := dat.DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error querying database: %v", err)
	}
	defer rows.Close()

	columnNames, err := rows.Columns()
	if err != nil {
		return nil, fmt.Errorf("error getting column names: %v", err)
	}

	var elements []map[string]interface{}
	for rows.Next() {
		element, err := scanRow(rows, columnNames)
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

func scanRow(rows *sql.Rows, columnNames []string) (map[string]interface{}, error) {
	columns := make([]interface{}, len(columnNames))
	columnPointers := make([]interface{}, len(columnNames))
	for i := range columns {
		columnPointers[i] = &columns[i]
	}

	if err := rows.Scan(columnPointers...); err != nil {
		return nil, err
	}

	element := make(map[string]interface{})
	for i, colName := range columnNames {
		element[colName] = convertValue(columns[i])
	}

	return element, nil
}

func convertValue(v interface{}) interface{} {
	switch value := v.(type) {
	case []byte:
		// Try to convert to float64 first (for numeric types)
		if f, err := strconv.ParseFloat(string(value), 64); err == nil {
			return f
		}
		// If not a float, return as string
		return string(value)
	default:
		return value
	}
}

func newHandler(dat *sql.DB) *db_handler_st {
	return &db_handler_st{DB: dat}
}
