export interface ForeignKeyValidator {
    validator: (objectId: string) => Promise<boolean>;
    message: string;
}
