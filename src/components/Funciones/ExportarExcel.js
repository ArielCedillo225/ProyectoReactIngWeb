import * as XLSX from "xlsx";

function excelDownload(data, nombre) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, nombre);
  XLSX.writeFile(workbook, `${nombre}.xlsx`);
}

export default excelDownload;
