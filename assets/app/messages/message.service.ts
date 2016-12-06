import {Message} from "./message.model";
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx'; // observable 3rd party library angular 2 uses
import {Injectable, EventEmitter} from "@angular/core";
import {Observable} from "rxjs";

@Injectable() // needed for http service
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http) {}

    addMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type' : 'application/json'});
        return this.http.post('http://localhost:3000/message', body, {headers: headers})
            .map((response: Response) => { // allows data transformation once obtained from server
                const result = response.json();
                const message = new Message(result.obj.content, 'Test User', result.obj._id, null);
                this.messages.push(message);
                return message;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message); // service now acts as middleman between input component and
                                         // message component which now uses this service and calls editMessage
    }

    updateMessage(message: Message){
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type' : 'application/json'});
        return this.http.patch('http://localhost:3000/message/' + message.messageId, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getMessages(){
        return this.http.get('http://localhost:3000/message') // no need to send body/headers since we aren't sending data
            .map((response: Response) => {
                const messages = response.json().obj;
                let formattedMessages: Message[] = [];
                for (let message of messages) {  // es6 for itterating through array
                    formattedMessages.push(new Message(message.content, 'Test', message._id, null))
                }
                this.messages = formattedMessages; // array we return is also the same
                return formattedMessages; // will automatically create new observable w/ formatted messages
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        return this.http.delete('http://localhost:3000/message/' + message.messageId)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}