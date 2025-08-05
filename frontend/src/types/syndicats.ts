export type Syndicat = {
    syndicat_id: number;
    name: string;
    categories_syndicats: {
        id: number;
        name: string
    }[]
}

export type GetSyndicats = Syndicat[]

export type SyndicatAllowed = {
    syndicat_id: number;
    name: string;
    infos: string
}

export type SyndicatsAllowed = SyndicatAllowed[]

