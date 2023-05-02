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
        if (dd.length > 0 && mm.length>0 && yyyy.length>0)
            return `${dd}/${mm}/${yyyy}`
        else
            return ''
    }
}

type ColumnsArragement = {
    email: number;
    prenom: number;
    nom: number;
    adresse: number;
    codePostal: number;
    ville: number;
    pays: number;
    telephone: number;
    cree: number;
    naissance?: number;
    taille?: number;
    poids?: number;
    licence?: number;
}

type Person = {
    email: string;
    prenom: string;
    nom: string;
    adresse: string;
    codePostal: string;
    ville: string;
    pays: string;
    telephone: string;
    cree: string;
    naissance: string;
    taille: string;
    poids: string;
    licence: string;
}

function getColumnsArrangement(row: string[]) {
    return {
        email: findColumn('email', row),
        prenom: findColumn('prénom', row),
        nom: findColumn('nom', row),
        adresse: findColumn('adresse', row),
        codePostal: findColumn('code postal', row),
        ville: findColumn('ville', row),
        pays: findColumn('pays', row),
        telephone: findColumn('téléphone', row),
        cree: findColumn('créé le', row),
        naissance: findColumn('date de naissance', row),
        taille: findColumn('taille', row),
        poids: findColumn('poids', row),
        licence: findColumn('licence', row)
    } as ColumnsArragement
}

function findColumn(name: string, row: string[]) {
    const index = row.findIndex(element => (typeof element !== "undefined" && (element.toLowerCase() == name)));
    if (index == -1) {
        return undefined
    } else {
        return index
    }
}

function getString(row: string[], index?: number) {
    if ((typeof index == "undefined") || (index == -1) || (typeof row[index as number] == "undefined")) {
        return ""
    } else {
        return row[index as number].toString();
    }
}
function getTelephone(row: string[], index?: number){
   let telephoneRaw = getString(row,index)
    if ((typeof telephoneRaw !== "undefined") && (telephoneRaw.length > 0)){
        telephoneRaw = `+${telephoneRaw}` // add + before phone 
    }
    return telephoneRaw
}

function getPerson(row: string[], columnsArragement: ColumnsArragement): Person {
    const person = {
        email: getString(row, columnsArragement.email),
        prenom: getString(row, columnsArragement.prenom),
        nom: getString(row, columnsArragement.nom),
        adresse: getString(row, columnsArragement.adresse),
        codePostal: getString(row, columnsArragement.codePostal),
        ville: getString(row, columnsArragement.ville),
        pays: getString(row, columnsArragement.pays),
        telephone: getTelephone(row, columnsArragement.telephone),
        cree: getDate(getString(row, columnsArragement.cree)),
        naissance: getDate(getString(row, columnsArragement.naissance)),
        taille: getString(row, columnsArragement.taille),
        poids: getString(row, columnsArragement.poids),
        licence: getString(row, columnsArragement.licence),
    }
    return person;
}

export function getPersons(binData: ArrayBuffer): string {
    const workbook = read(binData, { type: "array" })
    const data = workbook.Sheets[workbook.SheetNames[0]]
    const dataArray: any[][] = XLSX.utils.sheet_to_json(data, { header: 1 })
    const columnsArragement = getColumnsArrangement(dataArray[0])
    let csv = [] as string[]
    let persons = [] as Person[];
    csv.push(csvIseRow(dataArray[0]));
    for (let i = 1; i < dataArray.length; i++) {
        const person = getPerson(dataArray[i], columnsArragement);
        if ((typeof person.email !== "undefined") && (person.email !== "") && (person.email.length != 0) ) { persons.push(person) } //no email, no import !

        // if (typeof dataArray[i][7] !== "undefined" && dataArray[i][7].length != 0) { //no email, no import !
        //     // add + before phone
        //     if (typeof dataArray[i][6] !== "undefined") { dataArray[i][6] = "+" + dataArray[i][6] }
        //     // convert date
        //     dataArray[i][8] = getDate(dataArray[i][8]) //birth date
        //     dataArray[i][12] = getDate(dataArray[i][12]) //creation date
        //     csv.push(csvIseRow(dataArray[i]).replaceAll('""', ''));
        // }
    }
    //return csv.join('\n') + '\n' + getPersonsAsCsv(persons);
    return getPersonsAsCsv(persons);
}

export function getPersonsAsCsv(persons: Person[]) {
    const csv = [] as string[];
    csv.push('"Prénom","Nom","Adresse","Code Postal","Ville","Pays","Téléphone","Email","Date de naissance","Poids","Taille","Licence","Créé le"');
    persons.forEach(person => {
        const line = csvIseRow(
            [person.prenom,
            person.nom,
            person.adresse,
            person.codePostal,
            person.ville,
            person.pays,
            person.telephone,
            person.email,
            person.naissance,
            person.poids,
            person.taille,
            person.licence,
            person.cree]).replaceAll('""', '')
        csv.push(line)
    })
    return csv.join('\n')
}