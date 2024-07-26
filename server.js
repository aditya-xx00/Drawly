const io=require('socket.io')(5000,{
    cors:{
        origin:'*'
    }
})

const rooms={};

io.on('connection',(socket)=>{
    console.log('New client Connected')

    socket.on('joinRoom',({roomId,userId}) =>{
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`)

        if(rooms[roomId]){
            socket.emit('initialData',rooms[roomId]);

        }else{
            rooms[roomId] =[]
        }
    })
    socket.on('draw' ,(data)=>{
        const{roomId} =data;
        if(rooms[roomId]){
            rooms[roomId].push(data);
        }else{
            rooms[roomId]=[data]
        }
        socket.to(roomId).emit('draw',data)
    })

    socket.on('clearCanvas',(roomId)=>{
        if(rooms[roomId]){
            rooms[roomId]=[];
        }
        socket.to(roomId).emit('clearCanvas')

    })

    socket.on('toolChange',({roomId,tool,value}) =>{
        socket.to(roomId).emit('toolChange',{tool,value})
    })

    socket.on('disconnect',()=>{
    console.log('Client Disconnected')
})
})