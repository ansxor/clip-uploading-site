fetch('http://localhost:3001/mytest')
    .then(res => res.json())
    .then(data => {
        let output = document.getElementById('output')
        data.forEach((user) => {
            let userRepresentation = document.createElement('div');
            userRepresentation.innerHTML = user.name;
            output.appendChild(userRepresentation)
        })
    })
    .catch(err => console.log(err))

