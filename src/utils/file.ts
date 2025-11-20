export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// export const exportHTMLTableToXLS = (defaultFileName: string, order?: "asc" | "desc") => {
//   const table = document.getElementById("tableData")
//   const tempTable = document.createElement("table")

//   if (order === "desc") {
//     const thead = table?.querySelector("thead")
//     if (thead) tempTable.appendChild(thead.cloneNode(true))

//     const tbodies = Array.from(table?.querySelectorAll("tbody") || [])
//     if (tbodies.length === 0) {
//       const rows = Array.from(table?.querySelectorAll("tr") || [])
//       const newTbody = document.createElement("tbody")
//       rows.reverse().forEach(r => newTbody.appendChild(r.cloneNode(true)))
//       tempTable.appendChild(newTbody)
//     } else {
//       tbodies.forEach(tbody => {
//         const newTbody = document.createElement("tbody")
//         const rows = Array.from(tbody.querySelectorAll("tr"))
//         rows.reverse().forEach(r => newTbody.appendChild(r.cloneNode(true)))
//         tempTable.appendChild(newTbody)
//       })
//     }
//   }

//   const worksheet = XLSX.utils.table_to_sheet(order === "desc" ? tempTable : table)
//   const workbook = XLSX.utils.book_new()
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
//   XLSX.writeFile(workbook, defaultFileName + ".xls")
// }

export const downloadFile = (data: any, fileName: string, fileType: string): void => {
  const blob = new Blob([data], { type: fileType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
