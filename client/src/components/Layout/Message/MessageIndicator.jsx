const MessageComposer = ({ pendingMessage }) => {

  const handleChange = (e) => {
    setPendingMessage(e.target.value);
+    trigger("message/edit/me")
  };

}