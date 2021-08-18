# Periscope-AI

[![License](https://img.shields.io/badge/License-Apache2-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## Table of Contents

- [What is the problem?](#what-is-the-problem)
- [How can technology help?](#how-can-technology-help)
- [Instructions](#instructions)
- [The Architecture](#architecture)

### What is the problem?

Most accidents at worksites(construction sites, oil rig, seaports) are attributed to equipment failure caused by human error.
This includes workers being in transportation accidents and getting struck by heavy machinery.
Bureau of Labor Statistics report shows that there are annually 195,600 of such injuries in Construction alone. 10 out of every 100,000 workers are lost to fatalities even now.
A banksman giving hand and arm signals to a crane operator, for instance, could be in grave danger simply by standing in the operator's blindspot(an area out of sight).
The National Highway Traffic Safety Administration (NHTSA) reported an estimated 840,000 blind spot accidents occur in the United States each year, resulting in around 300 fatalities.
(NHTSA) reported an estimated.
References:
https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/811144 2. https://bruscatolaw.com/blog/who-is-at-fault-in-a-blind-spot-accident/

### How can technology help?

Machine learning and computer vision technologies can improve communication between workers to reduce worksite accidents rooted in human error.
Our model was built to recognize and relay 4 distinct static OSHA hand signals from banksmen to operators.
By providing concurrent communication of the signaled messages, we can minimize reliance on a clear line of sight unhindered by poor visibility, obstructions, blindspots or misinterpretation.

### Instructions

#### Set up for local test

1. Clone the repository and install dependencies.

2. Start the server.

   `npm start`

3. As banksman, open `https://localhost:4000/broadcast.html` in web browser to begin broadcasting signals.

4. As operator, open `https://localhost:4000` in a new browser window to receive the interpreted signals.

### Live Demo

- Banksman: https://infinite-escarpment-26576.herokuapp.com/broadcast.html

- Operator: https://infinite-escarpment-26576.herokuapp.com

### The Architecture

![diagram](assets/architecture.png)
