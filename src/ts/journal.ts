const price_val = <HTMLDivElement>document.querySelector(".price-val");

async function fetchTransaction(): Promise<void> {
  try {
    const response = await fetch(
      "http://localhost:8080/A1_/runlive/transaction_detail"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const k = 5;
    const data = await response.json();
    price_val.innerHTML = ` (Key: ${data.transaction_detail_id[k]}),
                                        (Transaction ID: ${data.transaction_id_fk[k]}),
                                        (Account ID: ${data.account_id_fk[k]}),
                                        (Amount: ${data.amount[k]}),
                                        (Debit: ${data.is_debit[k]})`;
  } catch (error) {
    console.error("Error fetching price:", error);
    price_val.innerHTML = "Error loading price";
  }
}

fetchTransaction();
