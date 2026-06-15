import Papa from 'papaparse'

export const CSV_TEMPLATE_HEADERS = 'name,email,class_grade,section,parent_name,parent_email,parent_phone,roll_number'
export const CSV_TEMPLATE_EXAMPLE = 'John Doe,john@example.com,10,A,Jane Doe,jane@example.com,+1234567890,101'

export interface ParsedStudent {
  name: string
  email: string
  class_grade: string
  section: string
  parent_name?: string
  parent_email?: string
  parent_phone?: string
  roll_number?: string
}

export async function parseStudentCSV(file: File): Promise<{ valid: ParsedStudent[], errors: { row: number, message: string }[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const valid: ParsedStudent[] = []
        const errors: { row: number, message: string }[] = []

        results.data.forEach((row: any, index) => {
          const rowNum = index + 2 // +1 for 0-index, +1 for header
          
          if (!row.name || !row.email || !row.class_grade || !row.section) {
            errors.push({ row: rowNum, message: 'Missing required fields (name, email, class_grade, section)' })
            return
          }

          valid.push({
            name: row.name.trim(),
            email: row.email.trim(),
            class_grade: row.class_grade.trim(),
            section: row.section.trim(),
            parent_name: row.parent_name?.trim(),
            parent_email: row.parent_email?.trim(),
            parent_phone: row.parent_phone?.trim(),
            roll_number: row.roll_number?.trim(),
          })
        })

        resolve({ valid, errors })
      },
      error: (error: any) => reject(error)
    })
  })
}
