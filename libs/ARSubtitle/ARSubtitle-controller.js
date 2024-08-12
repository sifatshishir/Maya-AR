import ARMessage from "./subtitle/ARMessage.js";
import {VrMessagePriorityEnum} from "./ARSubtitleLiterals.js";

class ARSubtitleController {
    messageQueue;
    running;
    messages;
    maxMessages;
    currentY;
    maxHeightLimit;
    spacing;
    initialYPosAR;
    initialZPos;
    allowedPosition;
    initialYPosForVrMessage;

    constructor() {
        this.messageQueue = [];
        this.running = false;
        this.messages = [];
        this.maxMessages = 4;
        this.currentY = this.getInitialYPosForVRMessage();
        this.maxHeightLimit = 0;
        this.initialYPosForVrMessage = -1.3;
        this.spacing = 0.01;
        this.initialYPosAR = -2.0;
        this.initialZPos = -4;
        this.allowedPosition = {yPosition: this.initialYPosForVrMessage, maxHeight: this.maxHeightLimit};
    }

    addARMessage(properties) {
        this.messageQueue.push({properties});
        this.processARMessageQueue();
    }

    async processARMessageQueue() {
        if (this.messageQueue.length > 0) {
            const {properties} = this.messageQueue.shift();

            await this.processARMessage(properties);
            this.processARMessageQueue();
        }
    }

    async processARMessage(properties) {
        if (!properties.priority) {
            properties.priority = VrMessagePriorityEnum.HIGHPRIORITYINFO;
        }

        properties.spacing = this.spacing;
        await this.createMessage(properties);
    }

    async createMessage(properties) {
        let arMessage = this.createMessageObject(properties);
        const position = await this.allocatePosition(arMessage.getMessageHeight());
        arMessage.setPosition(position);
        arMessage.show();
        this.messages.push(arMessage);
        return arMessage;
    }

    createMessageObject(properties) {
        return new ARMessage(properties);
    }

    removeMessage(VRMessage) {
        let messageIndex;
        this.messages.forEach((message, index) => {
            if (VRMessage.messageId === message.messageId) {
                messageIndex = index;
            }
        });
        this.deallocatePosition(VRMessage.position, messageIndex);
        this.removeMessageFromList(VRMessage.messageId);
        VRMessage.disposeMessage();
    }

    getSpacing() {
        return this.spacing * 1;
    }

    removeMessageFromList(messageId) {
        let self = this;
        this.messages.forEach((message, index) => {
            if (message.messageId === messageId) {
                self.messages.splice(index, 1);
            }
        });

        if (!this.messages.length) {
            this.allowedPosition.yPosition = this.initialYPosForVrMessage;
        }
    }

    removeAllMessage() {
        this.messages.forEach((message) => {
            this.removeMessage(message);
        });

        if (!this.messages.length) {
            this.allowedPosition.yPosition = this.initialYPosForVrMessage;
        }
    }

    async allocatePosition(msgHeight) {
        if (this.allowedPosition.yPosition + msgHeight + this.getSpacing() > this.allowedPosition.maxHeight) {
            this.removeOlderMessageToAllocate(msgHeight);
        }

        this.updateAllowedPosition(msgHeight);
        return {
            xPosition: 0,
            yPosition: this.allowedPosition.yPosition,
            zPosition: this.initialZPos
        };
    }

    removeOlderMessageToAllocate(msgHeight) {
        let yPosition = this.allowedPosition.yPosition + msgHeight + this.getSpacing();
        while (yPosition > this.allowedPosition.maxHeight) {
            const lastMessage = this.messages[0];
            yPosition -= lastMessage.getMessageHeight() + this.getSpacing();
            this.removeMessage(lastMessage);
        }
    }

    updateAllowedPosition(msgHeight) {
        let lastMsgHeight = 0;
        if (this.messages.length) {
            lastMsgHeight = this.messages[this.messages.length - 1].getMessageHeight();
        }

        this.allowedPosition.yPosition += (msgHeight + lastMsgHeight) / 2 + this.getSpacing();
    }


    deallocatePosition(position, messageIndex) {
        if (!this.messages[messageIndex]) {
            return;
        }

        const height = this.messages[messageIndex].getMessageHeight();
        let prevMessageHeight = 0;
        if (this.messages.length > 1 && messageIndex === this.messages.length - 1) {
            prevMessageHeight = this.messages[this.messages.length - 2].getMessageHeight();
            this.allowedPosition.yPosition -= (height + prevMessageHeight) / 2 + this.getSpacing();
        } else {
            this.allowedPosition.yPosition -= height + this.getSpacing();
        }

        for (const message of this.messages) {
            if (message.position.yPosition > position.yPosition) {
                message.position.yPosition -= height + this.getSpacing();
                message.updatePositionY();
            }
        }
    }

    getInitialYPosForVRMessage() {
        return this.initialYPosAR;
    }
}


export default ARSubtitleController;