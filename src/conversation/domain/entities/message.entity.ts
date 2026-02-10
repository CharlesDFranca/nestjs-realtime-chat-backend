import { Entity } from "@/shared/domain/entities/entity";
import { MessageContent } from "../value-objects/message-content.vo";
import { MessageEditNotAllowedError } from "../errors/message-edit-not-allowed.error";
import { MessageEditExpiredError } from "../errors/message-edit-expired.error";

type MessageProps = {
    senderId: string;
    conversationId: string;
    content: string;
};

export class Message extends Entity {
    private static MAX_EDIT_TIME_IN_MINUTES = 15;
    private _editedAt?: Date;

    constructor(
        id: string,
        private readonly _senderId: string,
        private readonly _conversationId: string,
        private _content: MessageContent,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    static create(id: string, props: MessageProps): Message {
        const content = MessageContent.create(props.content);
        const now = new Date();

        return new Message(id, props.senderId, props.conversationId, content, now, now);
    }

    public get senderId(): string {
        return this._senderId;
    }

    public get conversationId(): string {
        return this._conversationId;
    }

    public get content(): MessageContent {
        return this._content;
    }

    public get editedAt(): Date | undefined {
        return this._editedAt;
    }

    public editContent(editorId: string, content: string) {
        if (editorId !== this.senderId) throw new MessageEditNotAllowedError();

        const diff = Date.now() - this.createdAt.getTime();

        if (diff > Message.MAX_EDIT_TIME_IN_MINUTES * 60 * 1000)
            throw new MessageEditExpiredError();

        const editedContent = MessageContent.create(content);

        if (this._content.equals(editedContent)) return;

        this._content = editedContent;
        this._editedAt = new Date();
        this.touch();
    }
}
