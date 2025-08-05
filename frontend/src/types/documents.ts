export type Document = {
    file_name: string;
    has_expired: boolean;
    expiration_date: string;
}

export type Documents = Document[]

export type GetDocuments = {
    files: Documents,
    total: number,
    page: number,
    limit: number,
}