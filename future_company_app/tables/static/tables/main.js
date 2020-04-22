let url = "https://recruitment.hal.skygate.io/companies";

let id, name, city;
let data;
let  avgInc=0, lastMonth, relevantYear;
let dataID;


    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            data = JSON.parse(request.responseText);
            for(let i in data){
                 id=data[i].id;
                 name=data[i].name;
                 city=data[i].city;



                    let urlID = "https://recruitment.hal.skygate.io/incomes/"+id;
                    let request = new XMLHttpRequest();
                    request.open("GET", urlID);
                    request.onreadystatechange = function() {
                        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                            dataID = JSON.parse(request.responseText);
                            


                            for (j in dataID){

                                let totInc=0;
                                for (r in dataID.incomes){
                                   totInc+=Number(dataID.incomes[r].value);
                                } 

                                totInc=Number(totInc.toFixed(2));
                            

                                avgInc=Number((totInc/dataID.incomes.length).toFixed(2));


                                const today = new Date();
                                lastMonth = today.getMonth()-3;
                                relevantYear = today.getFullYear();
                                
                                
                                if (lastMonth === -1) {
                                    relevantYear--;
                                    lastMonth = 11;
                                }


                                let totalIncome=dataID.incomes;
                                let sumMonth=0;
                                const totalForLastMonth = totalIncome.filter(y => {
                                const date = new Date(y.date);
                                if(date.getMonth() === lastMonth && date.getFullYear() === relevantYear){
                                    sumMonth+=1;
                                }
                                return date.getMonth() === lastMonth && date.getFullYear() === relevantYear;
                                
                                }).reduce((prev, curr) => prev + parseFloat(curr.value), 0);
                                
                                lastMonthInc=Number((totalForLastMonth/(sumMonth+1)).toFixed(2));
                            
                


                                    data[i].total=totInc;
                                    let total= data[i].total;

                                    data[i].average=avgInc;
                                    let average= data[i].average;

                                    data[i].lastMonthIncome=lastMonthInc;
                                    let lastMonthIncome=data[i].lastMonthIncome;
                                
                                    let objResult={};
                                    Object.assign(data, {'id': id, 'name': name, 'city': city, 'total': total, 'average': average, 'lastMonthIncome': lastMonthIncome });
                                    objResult=data;
                                    // console.log(objResult);
                                
                                    const tableBody=document.getElementById("tableParent");
                                    let dataHtml="";
                                    for(let person of objResult){
                                        dataHtml+=`<tr>
                                            <td>${person.id}</td>
                                            <td>${person.name}</td>
                                            <td>${person.city}</td>
                                            <td>${person.total}</td>
                                            <td>${person.average}</td>
                                            <td>${person.lastMonthIncome}</td>
                                        <tr>`
                                    }
                                    tableBody.innerHTML=dataHtml;

                             

                                return totInc;

                            }

                        }
                    }
                    request.send();


              
            }
        }
    }


    request.send();

// 
//____________Search function____________________________
//  

searchF=()=>{
    let input, filter, table, tr, td, cell, i, j;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableParent");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
          cell = tr[i].getElementsByTagName("td")[j];
          if (cell) {
            if (cell.innerHTML.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
              break;
            } 
          }
        }
    }
}

// 
//____________Sort table____________________________
// 

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
    const table = th.closest('table');
    console.log(table);
    Array.from(table.querySelectorAll('tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => table.appendChild(tr) );
})));

// 
//____________Pagination table____________________________
//


const table=document.getElementById("tableParent");
const list_items=table.rows;

const list_element=document.getElementById('tableParent');
const pagination_element=document.getElementById('pagination');

let current_page=1;
let rows=10;

function DisplayList(items, wrapper, rows_per_page, page){
    wrapper.innerHtml="";
    page--;

    let start=rows_per_page*page;
    let end=start+rows_per_page;
    let paginatedItems=items.slice(start, end)
    for(let i=0; i<paginatedItems.length; i++){
    let item=paginatedItems[i];

    let item_element=document.createElement('div');
    item_element.classList.add('item');
    item_element.innerText=item;

    wrapper.appendChild(item_element);
    }
}

function SetupPagination(items, wrapper, rows_per_page){
    wrapper.innerHtml="";

    let page_count=Math.ceil(items.length/rows_per_page);
    for(let i=1; i<page_count+1; i++){
    let btn=PaginationButton(i, items);
    wrapper.appendChild(btn);
    }
}
function PaginationButton(page, items){
    let button=document.createElement("button");
    button.innerText=page;

    if(current_page==page) button.classList.add('active');

    button.addEventListener('click', function(){
    current_page=page;
    DisplayList(items, list_element, rows, current_page);

    let current_btn=document.querySelector('.pagenumbers button.active')
    current_btn.classList.remove('.active');

    button.classList.add('.active');
    })

    return button;
}

DisplayList(list_items, list_element, rows, current_page);
SetupPagination(list_items, pagination_element, rows)