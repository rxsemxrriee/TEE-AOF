fetch('order.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('table-body');
        
        data.forEach(order => {
            const items = order.items || []; 
            const rowCount = items.length;
            const isEven = parseInt(order.order_id) % 2 === 1;
            const rowClass = isEven ? 'bg-even' : 'bg-odd';
                   

            items.forEach((item, index) => {
                let html = `<tr class="${rowClass}">`;

                if (index === 0) {
                    html += `<td rowspan="${rowCount}" style="vertical-align: top;">${order.order_id}</td>`;
                    html += `<td rowspan="${rowCount}" style="vertical-align: top;">${order.table_no}</td>`;
                }

                html += `<td>${item.name}</td>`;
                html += `<td>${item.qty}</td>`;
                

                if (index === 0) {
                    html += `<td rowspan="${rowCount}" style="vertical-align: top;">${order.timestamp || ''}</td>`;
                    html += `<td rowspan="${rowCount}" style="vertical-align: top;">${order.status || ''}</td>`;
                }

                html += '</tr>';
                tableBody.innerHTML += html;
            });
        });
    });