export type MessageHandler = (message: MessageType) => Promise<void>;

export type MessageType = {
  method: string;
  data: any;
}