var React = require("react");
var ContactsUI = require('./../contacts.jsx');
var ConversationMessageMixin = require('./mixin.jsx').ConversationMessageMixin;
import { Emoji, ParsedHTML } from '../../../ui/utils.jsx';

class PrivilegeChange extends ConversationMessageMixin {
    haveMoreContactListeners() {
        if (!this.props.message.meta || !this.props.message.meta.targetUserId) {
            return false;
        }

        var uid = this.props.message.meta.targetUserId;
        if (uid && M.u[uid]) {
            return uid;
        }
        return false;
    }
    render() {
        var self = this;

        var message = this.props.message;
        var chatRoom = this.props.message.chatRoom;
        var contact = self.getContact();
        var timestampInt = self.getTimestamp();
        var timestamp = self.getTimestampAsString();



        var datetime = <div className="message date-time simpletip"
            data-simpletip={time2date(timestampInt, 17)}>{timestamp}</div>;

        var displayName;
        if (contact) {
            displayName = M.getNameByHandle(contact.u);
        }
        else {
            displayName = contact;
        }

        var messages = [];



        var otherContact = M.u[message.meta.targetUserId] ? M.u[message.meta.targetUserId] : {
            'u': message.meta.targetUserId,
            'h': message.meta.targetUserId,
            'c': 0
        };

        var avatar = <ContactsUI.Avatar contact={otherContact}
            className="message avatar-wrapper small-rounded-avatar"
            chatRoom={chatRoom} />;
        var otherDisplayName = M.getNameByHandle(otherContact.u);

        var newPrivilegeText = "";
        if (message.meta.privilege === 3) {
            newPrivilegeText = l.priv_change_to_op;
        }
        else if (message.meta.privilege === 2) {
            newPrivilegeText = l.priv_change_to_std;
        }
        else if (message.meta.privilege === 0) {
            newPrivilegeText = l.priv_change_to_ro;
        }

        const text = newPrivilegeText
            .replace('[S]', '<strong>')
            .replace('[/S]', '</strong>')
            .replace('%s', `<strong>${megaChat.html(displayName)}</strong>`);

        messages.push(
            <div className="message body" data-id={"id" + message.messageId} key={message.messageId}>
                {avatar}
                <div className="message content-area small-info-txt selectable-txt">
                    <ContactsUI.ContactButton
                        className="message"
                        chatRoom={self.props.chatRoom}
                        contact={otherContact}
                        label={<Emoji>{otherDisplayName}</Emoji>}
                    />
                    {datetime}
                    <div className="message text-block">
                        <ParsedHTML>{text}</ParsedHTML>
                    </div>
                </div>
            </div>
        );


        return <div>{messages}</div>;
    }
};

export {
    PrivilegeChange
};
