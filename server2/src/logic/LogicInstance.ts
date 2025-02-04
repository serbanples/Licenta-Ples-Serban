import { ModelsInstance } from "../models/ModelsInstance";
import { AuthLib } from "./lib/AuthLib";

/** Class used to manage all business logic classes. */
export class LogicInstance {
    private modelsInstance: ModelsInstance;
    public authLib: AuthLib;

    constructor(models: ModelsInstance) {
        this.modelsInstance = models;
        this.authLib = new AuthLib(models.accountModel);
    }
}