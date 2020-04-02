import React from 'react'
import Chart from 'chart.js'
import styles from './PieChart.module.css'

Chart.defaults.global.legend.display = true;
var Component = React.Component;


class PieChart extends Component {
    constructor(props){
        super(props)
    }

    chartRef = React.createRef();

    componentDidMount(){
        const myChartRef = this.chartRef.current.getContext("2d");
        let total = 0;
        this.props.drugs.forEach(drug => total += drug.rank)
        this.props.drugs.forEach(drug => console.log(drug))


        new Chart(myChartRef, {
            type: "pie",
            data: {
                //Bring in data
                labels: this.props.drugs.map(drug => drug.drugName.replace(/_/g,' ')),
                datasets: [
                    {
                        label: "Drugs",
                        data: this.props.drugs.map(drug => Math.round(drug.rank *100)),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRation: false,
                tooltips: {
                    displayColors: false,
                    bodyFontSize: 12,
                    footerFontSize: 12,
                    footerAlign: 'center',
                    footerFontStyle: 'normal',
                    footerFontColor: '#9fa2a6',
                    titleFontSize: 16,
                    titleFontColor: '#ffffff',
                    titleAlign: 'center',
                    bodyAlign: 'center',
                    callbacks: {
                        title: (tooltipItem, data) => {
                            let label = data.labels[tooltipItem[0].index];
                            let value = data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index] || 0;

                            return [label,`${value}%`];
                        },
                        label: (tooltipItem, data) => {
                            let symptoms = this.props.drugs.filter(drug => drug.drugName.replace(/_/g,' ') === data.labels[tooltipItem.index])[0].associatedSymptoms
                            symptoms = symptoms.map(symptom => symptom.replace(/_/g,' '))
                            return symptoms;
                        },
                        footer: (tooltipItem, data) => {
                            let symptoms = this.props.drugs.filter(drug => drug.drugName.replace(/_/g,' ') === data.labels[tooltipItem[0].index])[0].nonAssociatedSymptoms
                            symptoms = symptoms.map(symptom => symptom.replace(/_/g,' '))
                            return symptoms;
                        }
                    }
                }
            }
        });

        
        let displayDrugs = this.props.drugs.map(drug => {return {label: drug.drugName, y:Math.floor((drug.rank/total)*100)}})
    }

	render() {
		
		return (
		<div className={styles.root}>
            <canvas 
                ref={this.chartRef}
                />
		</div>
		);
	}
}

export default PieChart
