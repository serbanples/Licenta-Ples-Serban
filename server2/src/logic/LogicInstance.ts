import { ModelsInstance } from "../models/ModelsInstance";
import { AuthLib } from "./lib/AuthLib";
import { MailLib } from "./lib/MailLib";

/** Class used to manage all business logic classes. */
export class LogicInstance {
    private modelsInstance: ModelsInstance;
    public authLib: AuthLib;
    public mailLib: MailLib;

    constructor(models: ModelsInstance) {
        this.modelsInstance = models;
        this.authLib = new AuthLib(models.accountModel);
        this.mailLib = new MailLib();
    }
}