/*!
=========================================================
* © 2023 Ronan LE MEILLAT for Les Ailes du Mont-Blanc
=========================================================
This website use:
- Vite, Vue3, FontAwesome 6, TailwindCss 3
- And many others
*/
import * as XLSX from 'xlsx';
const { read } = XLSX

function csvIseRow(rowAsArray: string[]): string {
    let row = `"${rowAsArray[0]}"`
    for (let i = 1; i < rowAsArray.length; i++) {
        if (typeof rowAsArray[i] === "undefined") {
            row += `,`
        } else if (typeof rowAsArray[i] === "number") {
            row += `,${rowAsArray[i]}`
        } else {
            row += `,"${rowAsArray[i]}"`
        }
    }
    return row;
}

function getDate(sz: string): string {
    if (typeof sz === "undefined") {
        return ''
    }
    else {
        const dd = sz.substring(0, 2)
        const mm = sz.substring(3, 5)
        const yyyy = sz.substring(6)
        return `${dd}/${mm}/${yyyy}`
    }
}


export function getStudents(binData: ArrayBuffer): string {
    const workbook = read(binData, { type: "array" })
    const data = workbook.Sheets[workbook.SheetNames[0]]
    const dataArray: any[][] = XLSX.utils.sheet_to_json(data, { header: 1 })

    let csv = [] as string[]
    csv.push(csvIseRow(dataArray[0]));
    for (let i = 1; i < dataArray.length; i++) {
        if (typeof dataArray[i][7] !== "undefined" && dataArray[i][7].length != 0) { //no email, no import !
            // add + before phone
            if (typeof dataArray[i][6] !== "undefined") { dataArray[i][6] = "+" + dataArray[i][6] }
            // convert date
            dataArray[i][8] = getDate(dataArray[i][8]) //birth date
            dataArray[i][12] = getDate(dataArray[i][12]) //creation date
            csv.push(csvIseRow(dataArray[i]).replaceAll('""', ''));
        }

    }
    return csv.join('\n')
}
