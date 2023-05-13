import React, { useState } from 'react';
import { Chart } from 'chart.js/auto';

import './App.css';

function App() {
  const [wordCountData, setWordCountData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('https://www.terriblytinytales.com/test.txt');
    const text = await response.text();

    const words = text.split(/\s+/); // split text into words
    const wordCounts = {};
    words.forEach((word) => {
      const trimmedWord = word.trim().toLowerCase();
      if (trimmedWord) {
        wordCounts[trimmedWord] = wordCounts[trimmedWord] ? wordCounts[trimmedWord] + 1 : 1;
      }
    });

    // sort the words in descending order of their count
    const sortedWordCounts = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);

    // take the top 20 most frequent words
    const top20WordCounts = sortedWordCounts.slice(0, 20);

    // prepare the data for the chart
    const chartLabels = top20WordCounts.map((wordCount) => wordCount[0]);
    const chartData = top20WordCounts.map((wordCount) => wordCount[1]);

    // set the chart data
    setWordCountData({ labels: chartLabels, data: chartData });
  };

  const handleExport = () => {
    if (!wordCountData) {
      return;
    }

    const csvRows = [];
    csvRows.push(['Word', 'Count']);
    wordCountData.labels.forEach((label, index) => {
      csvRows.push([label, wordCountData.data[index]]);
    });

    const csvString = csvRows.map((row) => row.join(',')).join('\n');

    const downloadLink = document.createElement('a');
    downloadLink.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvString)}`;
    downloadLink.download = 'word-count-data.csv';
    downloadLink.click();
  };

  const renderChart = () => {
    if (!wordCountData) {
      return;
    }

    const ctx = document.getElementById('chart').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: wordCountData.labels,
        datasets: [
          {
            label: 'Word Count',
            data: wordCountData.data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              beginAtZero: true,
            },
          },
        },
      },
    });
  };

  return (
    <div className="App">
      <h1>Word Count Histogram</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
      {wordCountData && (
        <>
          <canvas id="chart" width="400" height="400"></canvas>
          <button onClick={handleExport}>Export</button>
        </>
      )}
      <p className="credits">Made with ❤️ by Aman Gupta </p>
    </div>
  );
}

export default App;


