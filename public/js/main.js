class ChatManager {
    constructor () {
        const firebaseApp = firebase.initializeApp({
            projectId: "yamadashi-test",
        });
        const firestore = firebaseApp.firestore()
        firestore.settings({
            timestampsInSnapshots: true
        });

        this.chatsRef = firestore.collection('chats');
        this._setEventHandler();
    }
    
    _setEventHandler() {
        $('.chat-form').submit(this.onSubmitForm.bind(this));

        this.chatsRef.orderBy("timestamp").onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    const chat = change.doc.data();
                    const author = chat.author || "名無し";
                    const content = chat.content || "";
                    $('.chat-list').prepend($('<li>').text(`${author} : ${content}`));
                }
            });
        });
    }

    onSubmitForm(e) {
        e.preventDefault();

        const author = $('.chat-author-input').val();
        const content = $('.chat-content-input').val();

        this.chatsRef.add({
            author: author || "名無し",
            content: content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        $('.chat-content-input').val('');
    }
}


$(() => {
    const chatManager = new ChatManager();
})
