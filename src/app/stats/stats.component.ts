import { ChangeDetectorRef, Component } from '@angular/core';
import { Deck } from '../Models/Deck';
import { StatsService } from '../services/stats.service';
import { CardServiceService } from '../services/card-service.service';
import { StatsDTO } from '../Models/StatsDTO';
import { CanvasJS } from '@canvasjs/angular-charts';

CanvasJS.addColorSet("PieChartColorSet", ["#A2A1A1", "#4368FF", "#9643FF", "#FFC550"]);
CanvasJS.addColorSet("ColumnChartColorSet", ["#1E62FF","#FF3D1E"]);

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {

  selectedDeck:number = 0;
  deckList : Deck[] = [];
  stats? : StatsDTO;

  Wins:number = 0;
  Loses:number = 0;

  dataLoaded = false;


  PieChart = {
	  animationEnabled: true,
    theme:"dark2",
    colorSet:"PieChartColorSet",
	  title: {
		text: "Nombre de cartes par rareté"
	  },
	  data: [{
		type: "pie",
		startAngle: -90,
		indexLabel: "{name}: {y}",
		yValueFormatString: "####",
		dataPoints: [
		  { y: 0, name: "Commune" },
		  { y: 0, name: "Rare" },
		  { y: 0, name: "Épique" },
		  { y: 0, name: "Légendaire" }
		]
	  }]
	}	

  BarChart = {
    title:{
      text: "Coût en mana"
    },
    theme:"dark2",
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: ""
    },
    data: [{
      type: "bar",
      indexLabel: "{y}",
      yValueFormatString: "####",
      dataPoints: [
        {label: "1", y: 0},
		    {label: "2", y: 0},
		    {label: "3", y: 0},
		    {label: "4", y: 0},
		    {label: "5", y: 0},
		    {label: "6", y: 0},
		    {label: "7", y: 0},
		    {label: "8", y: 0},
        {label: "9", y: 0},
        {label: "10", y: 0},
        {label: "11", y: 0},
        {label: "12", y: 0},
        {label: "13", y: 0},
        {label: "14", y: 0},
        {label: "15", y: 0},
        {label: "16", y: 0},
        {label: "17", y: 0},
        {label: "18", y: 0},
        {label: "19", y: 0},
        {label: "20", y: 0},
      ]
    }]
  }	

  ColumnChart = {
	  animationEnabled: true,
	  title: {
		text: "Attaque et Défense"
	  },
    theme:"dark2",
    colorSet:"BarChartColorSet",
	  axisX: {
		labelAngle: -90
	  },
	  axisY: {
		title: "Nombre de carte"
	  },
	  toolTip: {
		shared: true
	  },
	  legend:{
		cursor:"pointer",
		itemclick: function(e: any){
		  if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		  }
		  else {
			e.dataSeries.visible = true;
		  }
		  e.chart.render();
		}
	  },
	  data: [{
		type: "column",	
		name: "Attaque",
		legendText: "Attaque",
		showInLegend: true, 
		dataPoints:[
		  {label: "1", y: 0},
		  {label: "2", y: 0},
		  {label: "3", y: 0},
		  {label: "4", y: 0},
		  {label: "5", y: 0},
		  {label: "6", y: 0},
		  {label: "7", y: 0},
		  {label: "8", y: 0},
		  {label: "9", y: 0},
		  {label: "10", y: 0},
      {label: "11", y: 0},
      {label: "12", y: 0},
      {label: "13", y: 0},
      {label: "14", y: 0},
      {label: "15", y: 0},
		]
	  }, {
		type: "column",	
		name: "Défense",
		legendText: "Défense",
		showInLegend: true,
		dataPoints:[
      {label: "1", y: 0},
		  {label: "2", y: 0},
		  {label: "3", y: 0},
		  {label: "4", y: 0},
		  {label: "5", y: 0},
		  {label: "6", y: 0},
		  {label: "7", y: 0},
		  {label: "8", y: 0},
		  {label: "9", y: 0},
		  {label: "10", y: 0},
      {label: "11", y: 0},
      {label: "12", y: 0},
      {label: "13", y: 0},
      {label: "14", y: 0},
      {label: "15", y: 0},
		]
	  }]
	}

  constructor(public statsService : StatsService, public cardService : CardServiceService) {}

  async ngOnInit(): Promise<void> {
    try{
      //Recevoir les stats et deck list
      this.stats = await this.statsService.GetGeneralStats();
      console.log(this.stats);
      this.deckList = await this.cardService.getDecks();

      //Compter les attaques et populer la chart
      const attackCounts = this.countAttack(this.stats);
      this.ColumnChart.data[0].dataPoints.forEach((dataPoint, index)=> {
        dataPoint.y = attackCounts[index];
      });

      //Compter les defenses et populer la chart
      const defenseCounts = this.countDefense(this.stats);
      this.ColumnChart.data[1].dataPoints.forEach((dataPoint, index)=> {
        dataPoint.y = defenseCounts[index];
      });

      //Compter le mana et populer la chart
      const manaCost = this.countMana(this.stats);
      this.BarChart.data[0].dataPoints.forEach((dataPoint, index)=> {
        dataPoint.y = manaCost[index];
      })

      //Compter la rarity et populer la chart
      const rarityCounts = this.countRarity(this.stats);
      this.PieChart.data[0].dataPoints.forEach((dataPoint, index)=> {
        dataPoint.y = rarityCounts[index];
      })

      this.dataLoaded = true;
    }
    catch(e){
      console.error('Error fetching stats:', e);
    }
  }
  
  countAttack(stats:StatsDTO){
    const attackCounts = Array(15).fill(0);

    if(this.stats != undefined){
      for(let c of this.stats.cards){
        const attackValue = c.attack;
        if(attackValue >= 1 && attackValue <= 15){
          attackCounts[attackValue - 1]++;
        }
      }
    }

    return attackCounts;
  }

  countDefense(stats:StatsDTO){
    const defenseCounts = Array(15).fill(0);

      for(let c of stats.cards){
        const defenseValue = c.defense;
        if(defenseValue >= 1 && defenseValue <= 15){
          defenseCounts[defenseValue - 1]++;
        }
      }

    return defenseCounts;
  }

  countRarity(stats:StatsDTO){
    const rarityCounts = Array(4).fill(0);

    for(let c of stats.cards){
      const rarityValue = c.rarity;
      if(rarityValue >= 0 && rarityValue <= 3){
        rarityCounts[rarityValue]++;
      }
    }

    return rarityCounts;
  }

  countMana(stats:StatsDTO){
    const manaCounts = Array(20).fill(0);

    for(let c of stats.cards){
      const manaCost = c.manaCost;
      if(manaCost >=0 && manaCost <= 20){
        manaCounts[manaCost -1]++;
      }
    }

    return manaCounts;
  }

  async getDeckStats(){
    console.log(this.selectedDeck);

    this.dataLoaded = false;

    this.stats = await this.statsService.GetDeckStats(this.selectedDeck);

    //Compter les attaques et populer la chart
    const attackCounts = this.countAttack(this.stats);
    this.ColumnChart.data[0].dataPoints.forEach((dataPoint, index)=> {
      dataPoint.y = attackCounts[index];
    });

    //Compter les defenses et populer la chart
    const defenseCounts = this.countDefense(this.stats);
    this.ColumnChart.data[1].dataPoints.forEach((dataPoint, index)=> {
      dataPoint.y = defenseCounts[index];
    });

    //Compter le mana et populer la chart
    const manaCost = this.countMana(this.stats);
    this.BarChart.data[0].dataPoints.forEach((dataPoint, index)=> {
      dataPoint.y = manaCost[index];
    })

    //Compter la rarity et populer la chart
    const rarityCounts = this.countRarity(this.stats);
    this.PieChart.data[0].dataPoints.forEach((dataPoint, index)=> {
      dataPoint.y = rarityCounts[index];
    })

    this.dataLoaded = true;
  }
}
