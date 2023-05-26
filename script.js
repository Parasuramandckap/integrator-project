
let section = document.querySelector(".NoOfCards")
let header = document.querySelector(".buttonses")
let share = document.querySelector(".share")

let filter = document.querySelector(".filter")
let DynamicStarBtn = [];




window.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:4000/projects`)
        .then(res => res.json())
        .then(data => {

            projectsGenarate(data)
            data.forEach((element) => {
                if (element.is_starred) {
                    if (DynamicStarBtn.indexOf("is_starred") == -1) {
                        DynamicStarBtn.push("is_starred")
                    }

                }
                if (element.category == "my_projects") {
                    if (DynamicStarBtn.indexOf("my_projects") == -1) {
                        DynamicStarBtn.push(element.category)
                    }
                }
                if (element.category == "shared_projects") {
                    if (DynamicStarBtn.indexOf("shared_projects") == -1) {
                        DynamicStarBtn.push(element.category)
                    }
                }
            })

            //creating DynamicStarBtn for three button
            DynamicStarBtn.forEach((btns) => {
                let button = document.createElement("button")
                button.setAttribute("class", `${btns} category`)
                button.setAttribute("id", "filter")
                button.innerText = btns
                header.appendChild(button)

            })

            // categoryBtn  addEventListener
            let categoryBtn = document.querySelectorAll("#filter")
            categoryBtn.forEach((btns) => {
                btns.addEventListener("click", (e) => {
                    if (e.target.classList[0] == "is_starred") {
                        favorite()
                    }
                    else {
                        categoryFilter(e.target.classList[0])

                    }

                    for (let i = 0; i < categoryBtn.length; i++) {
                        categoryBtn[i].classList.remove("show")
                    }

                    e.target.classList.add("show")
                })
            })


            //page loaded show limited data


        })

})


//this function use to filter category
function categoryFilter(e) {
    fetch(`http://localhost:4000/projects?category=${e}`)
        .then(res => res.json())
        .then(data => {
            projectsGenarate(data)
        })
}
//this funtion creating htlm elements
function projectsGenarate(allprojects) {

    let elementHtml = allprojects.map(element => {
        let split = element.project_name.split(" ")

        let Stars = element.is_starred ? `<i class="fa-solid fa-star starBtn" id=${element.id}></i> ` : `<i class="fa-regular fa-star starBtn" id=${element.id}></i>`
        let htmls = `
        <div class = "mainParentDiv" >
        <div class = "ContentparentDiv" >
         <div class = "UserDetails">
            <p class = "Userinitial">${split[0][0].toUpperCase()}${split[1][0].toUpperCase()}</p>
            <p class = "Usertitle project-name">${element.project_name}</p>
            <p class= "owener-name">${element.owner_name}</p>
            <p class= "category-name">${element.category}</p>
         </div>
         <div class = "actionBtns">
            <p class = "star">${Stars}</i></p>
            <p class = "delete"><i class="fa-sharp fa-solid fa-trash deleteBtn" id = ${element.id}></i></p>
         </div>
        </div>
        </div>
        `
        return htmls

    }).join("")
    section.innerHTML = elementHtml

    let star = document.querySelectorAll(".starBtn")
    let project_name = document.querySelector(".project-name")
    let ower_name = document.querySelector(".owener-name")
    let category = document.querySelector(".category-name")
    let deleteIcon = document.querySelectorAll(".deleteBtn")



    //star button addEventListener
    star.forEach((starBtn) => {
        starBtn.addEventListener("click", (e) => {
            window.location.reload()
            let targetId = e.target.id
            if (e.target.classList.contains("fa-solid")) {
                e.target.classList.remove("fa-solid")
                e.target.classList.add("fa-regular")
                check(e.target, project_name, ower_name, category, false)
            }
            else {
                e.target.classList.remove("fa-regular")
                e.target.classList.add("fa-solid")
                check(e.target, project_name, ower_name, category, true)
            }
        })
    })

    //delete btn addEventListener
    deleteIcon.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (e) => {
            let deleteId = e.target.id
            removeProject(deleteId)
        })
    })


    //pagination completed ********************************************************************************

    var div = document.querySelectorAll(".mainParentDiv")


    let thisPage = 1;
    let limit = 6;


    function loadItem() {

        let beginGet = limit * (thisPage - 1);
        let endGet = limit * thisPage - 1;

        div.forEach((item, key) => {
            if (key >= beginGet && key <= endGet) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        })
        listPage()

    }
    loadItem()


    function listPage() {
        let count = Math.ceil(div.length / limit);
        document.querySelector('.pges-count').innerHTML = '';

        document.querySelector(".page").innerText = `Total records ${div.length} : ${thisPage} of ${count}`
        document.querySelector(".total-records").innerText = ``
        if (thisPage != 1) {

            let moveBanck =  document.createElement("a")
            moveBanck.innerText = "<<"
            moveBanck.setAttribute("data-set", (thisPage - 1))
            document.querySelector('.pges-count').appendChild(moveBanck);
            moveBanck.addEventListener("click", (e) => changePage(e))


            let prev = document.createElement('a');
            prev.innerText = '<';
            prev.setAttribute("data-set", (thisPage - 1))

            document.querySelector('.pges-count').appendChild(prev);
            prev.addEventListener("click", (e) => changePage(e))

        }

        for (i = 1; i <= count; i++) {
            let newPage = document.createElement('a');
            newPage.innerText = i;
            if (i == thisPage) {
                newPage.classList.add('active');
            }

            newPage.setAttribute("data-set", i)
            document.querySelector('.pges-count').appendChild(newPage);
            newPage.addEventListener("click", (e) => changePage(e))
        }

        if (thisPage != count) {
            let next = document.createElement('a');
            next.innerText = '>';
            next.setAttribute("data-set", (thisPage + 1))
            document.querySelector('.pges-count').appendChild(next);
            next.addEventListener("click", (e) => changePage(e))

            let moveForward =  document.createElement("a")
            moveForward.innerText = ">>"
            moveForward.setAttribute("data-set", (thisPage + 1))
            document.querySelector('.pges-count').appendChild(moveForward);
            moveForward.addEventListener("click", (e) => changePage(e))

        }
    }


    function changePage(e) {
        let id = e.target.dataset.set
        thisPage = Number(id)
        loadItem()
    }


    //pagination completed ***************************************************************************
}










//this function filter favorite items
function favorite() {
    fetch(`http://localhost:4000/projects?is_starred=true`)
        .then(res => res.json())
        .then(data => {
            projectsGenarate(data)
        })
}

//delete projects
function removeProject(deleteId) {
    fetch(`http://localhost:4000/projects/${deleteId}`, {
        method: "DELETE",
        headers: {
            'Content-type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
}

//this funtion for chage favorate and remove favorate
function check(element, project_name, owner_Name, category, condition) {

    //   console.log(element, project_name, owner_Name, category, condition);

    fetch(`http://localhost:4000/projects/${element.id}`, {
        method: "PUT",
        body: JSON.stringify({
            "project_name": project_name.innerText,
            "owner_name": owner_Name.innerText,
            "is_starred": condition,
            "category": category.innerText,
            "id": element.id
        }), headers: {
            'Content-type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
}


//search functionality completed

let inputsearch = document.querySelector(".inputsearch")
let divmain = document.querySelector(".checkbox")

inputsearch.addEventListener("keyup", (e) => {
    fetch(`http://localhost:4000/projects`)
        .then(res => res.json())
        .then(data => {
            projectsGenarate(data)

           
            let searchItem = []
            data.forEach(element => {
                let search = e.target.value.toUpperCase()
                let dataProjectname = element.project_name.toUpperCase()
                if (inputsearch.value.trim() != "") {
                    if (dataProjectname.indexOf(search) != -1) {
                        searchItem.push(element)
                        projectsGenarate(searchItem)
                    }

                }
            })
            createCheckbox(searchItem)
        })
})


function createCheckbox(owenerName) {

    let array = [];

    owenerName.forEach((usrname)=>{
        if(array.indexOf(usrname.owner_name) == -1){
            array.push(usrname.owner_name)
        }
    })
    console.log(array);

    let element = array.map(element=>{
        let html = `
        <div class="checkbox">
            <input type="checkbox" checked id=${element.id}><p class="checked-name" >${element}</p>
        </div>
        `
        return html
    }).join(" ")

    divmain.innerHTML = element

}







































































































































































