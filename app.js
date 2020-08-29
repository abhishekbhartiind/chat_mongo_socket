const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./libs/db-connection');

app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

const Chat = require('./models/Chat');
const User = require('./models/User');
const Groups = [
  {group_id: "A", user_id: "5f497db49f448f34bb7c3062"},
  {group_id: "A", user_id: "5f497dfb9a85fa34f031d88c"},
  {group_id: "B", user_id:"5f497e7b9a85fa34f031d88d"}
]

app.get('/', (req, res) => {
  Chat.find({group_id: "A"}).then(messages => {
    res.render('index', {messages});
  }).catch(err => console.error(err));
});

io.on('connection', socket => {
    socket.on('chat', async data => {
      try {
          const user = await User.findOne({name: data.handle })
          let details = {};
          if(user !== null){
            details = await User.findOneAndUpdate({name: data.handle}, {socket_id: socket.id}, {new: true})
          } else {
            details = await User.create({socket_id: socket.id, name: data.handle})
          }
          if(details !== null){
            // groupa, user_id
            let group = Groups.filter(grp => grp.user_id == details._doc._id)
            await Chat.create({name: data.handle, message: data.message, group_id: group[0]["group_id"]})
            // select whom to send 
            // group_id => list of user_id => list of socket_id
            let user_ids = Groups.filter(grp => grp.group_id === group[0]["group_id"]).map(grp => grp.user_id)
            console.log(user_ids, "user_ids")
            user_ids.forEach(async users => {
              const userInfo = await User.findById({ _id: users })
              if(userInfo !== null && userInfo._doc !== null){
                io.to(userInfo._doc.socket_id).emit('chat', data);
              }
            })
          }
      } catch (error) {
        console.log(error, "err in try catch")
      }
    })
    socket.on('typing', data => {
      socket.broadcast.emit('typing', data); // return data
    });
});

// listen
http.listen(process.env.PORT || 3000, () => {
  console.log('Running');
});
