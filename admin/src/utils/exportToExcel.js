import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

/**
 * Xuất Excel tái sử dụng
 * @param {Object[]} sheets - Danh sách sheet [{ name, data }]
 * @param {string} fileName - Tên file Excel (mặc định: export.xlsx)
 * 
 * data: có thể là Array<Object> (JSON) hoặc Array<Array> (AOA)
 */
export const exportToExcel = (sheets, fileName = "export.xlsx") => {
    const wb = XLSX.utils.book_new()

    sheets.forEach(({ name, data }) => {
        let ws
        if (Array.isArray(data) && data.length > 0) {
            if (Array.isArray(data[0])) {
                // Nếu là AOA (Array of Array)
                ws = XLSX.utils.aoa_to_sheet(data)
            } else {
                // Nếu là JSON (Array of Object)
                ws = XLSX.utils.json_to_sheet(data)
            }
        } else {
            ws = XLSX.utils.aoa_to_sheet([["Không có dữ liệu"]])
        }
        XLSX.utils.book_append_sheet(wb, ws, name)
    })

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName)
}
