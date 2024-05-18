import * as XLSX from "xlsx";

function excelDownload(Estados) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(Estados);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Estados");
  XLSX.writeFile(workbook, "estados.xlsx");
}

export default excelDownload;
