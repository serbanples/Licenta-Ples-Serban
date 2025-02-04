export type MessageHandler = (message: MessageType) => Promise<void>;

/** message type type */
export type MessageType = {
  method: string; // method to call on server
  data: any[]; // data to call method with: [Obj1, obj2, etc...]
}