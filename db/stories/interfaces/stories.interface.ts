export interface StoriesInterface {
    id?: number;
    title: string;
    theme: string;
    story_hash: string;
    author_id: number;
    created_at: Date | string;
    updated_at: Date | string;
}
