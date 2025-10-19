// src/utils/gameLogic/colorGrid.js
import * as THREE from 'three';

const DIFFICULTY_CONFIG = {
  easy: {
    gridSize: 3,
    timeLimit: 120,
    colorsCount: 6,
    rotationSpeed: 0.005,
    hoverScale: 1.1,
    pointsMultiplier: 1
  },
  medium: {
    gridSize: 4,
    timeLimit: 90,
    colorsCount: 8,
    rotationSpeed: 0.008,
    hoverScale: 1.15,
    pointsMultiplier: 1.2
  },
  hard: {
    gridSize: 5,
    timeLimit: 75,
    colorsCount: 12,
    rotationSpeed: 0.012,
    hoverScale: 1.2,
    pointsMultiplier: 1.5
  },
  extreme: {
    gridSize: 6,
    timeLimit: 60,
    colorsCount: 18,
    rotationSpeed: 0.015,
    hoverScale: 1.25,
    pointsMultiplier: 2
  }
};

function generateColors(count) {
  const colors = [];
  const hueStep = 360 / count;
  
  for (let i = 0; i < count; i++) {
    const hue = (i * hueStep) % 360;
    const saturation = 70 + Math.random() * 25;
    const lightness = 45 + Math.random() * 25;
    
    const color = new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    colors.push(color);
  }
  
  return colors;
}

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function createColorGridGame(difficulty, scene) {
  const config = DIFFICULTY_CONFIG[difficulty];
  let gameState = {
    grid: [],
    targetColor: '',
    selectedCells: [],
    matchedCells: [],
    score: 0,
    streak: 0,
    bestStreak: 0,
    moves: 0,
    accuracy: 1,
    timeRemaining: config.timeLimit,
    timeLimit: config.timeLimit,
    gridSize: config.gridSize
  };

  let colors = [];
  let cellObjects = [];
  let targetColorObj = null;
  let hoveredCellIndex = null;
  let startTime = Date.now();
  let lastUpdateTime = startTime;
  let rotationAngle = 0;

  // Initialize game
  function init() {
    colors = generateColors(config.colorsCount);
    gameState.grid = [];
    gameState.matchedCells = [];
    gameState.selectedCells = [];
    gameState.score = 0;
    gameState.streak = 0;
    gameState.moves = 0;
    gameState.accuracy = 1;
    gameState.timeRemaining = config.timeLimit;

    // Create color pairs
    const colorPairs = [];
    colors.forEach(color => {
      colorPairs.push(color);
      colorPairs.push(color.clone());
    });

    // Shuffle pairs
    for (let i = colorPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorPairs[i], colorPairs[j]] = [colorPairs[j], colorPairs[i]];
    }

    // Create grid cells
    const totalCells = config.gridSize * config.gridSize;
    cellObjects = [];
    
    for (let i = 0; i < totalCells; i++) {
      const color = colorPairs[i];
      const cell = createCell(i, color);
      cellObjects.push(cell);
      scene.add(cell);
      
      gameState.grid.push({
        color: hslToHex(color.getHSL().h * 360, color.getHSL().s * 100, color.getHSL().l * 100),
        index: i,
        matched: false
      });
    }

    // Set target color (first unmatched cell)
    const firstUnmatched = gameState.grid.find(cell => !cell.matched);
    if (firstUnmatched) {
      gameState.targetColor = firstUnmatched.color;
      targetColorObj = colors.find(color => 
        hslToHex(color.getHSL().h * 360, color.getHSL().s * 100, color.getHSL().l * 100) === firstUnmatched.color
      );
    }

    startTime = Date.now();
    lastUpdateTime = startTime;
  }

  function createCell(index, color) {
    const geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const material = new THREE.MeshPhongMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.9,
      shininess: 60
    });

    const cell = new THREE.Mesh(geometry, material);
    
    const gridSize = config.gridSize;
    const spacing = 2.2;
    const offset = (gridSize - 1) * spacing * 0.5;
    
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    
    cell.position.x = col * spacing - offset;
    cell.position.y = row * spacing - offset;
    cell.position.z = 0;
    
    // Add wireframe
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
    );
    cell.add(line);
    
    // Add glow effect
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const glowGeometry = new THREE.BoxGeometry(2.0, 2.0, 2.0);
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    cell.add(glow);
    
    cell.userData = {
      isCell: true,
      index: index,
      originalColor: color.clone(),
      originalScale: 1,
      isMatched: false,
      isSelected: false
    };
    
    return cell;
  }

  function setHoveredCell(index) {
    // Reset previous hover
    if (hoveredCellIndex !== null && hoveredCellIndex !== index) {
      const prevCell = cellObjects[hoveredCellIndex];
      if (prevCell && !prevCell.userData.isMatched) {
        prevCell.scale.setScalar(prevCell.userData.originalScale);
      }
    }
    
    hoveredCellIndex = index;
    
    // Apply hover effect
    if (index !== null) {
      const cell = cellObjects[index];
      if (cell && !cell.userData.isMatched && !cell.userData.isSelected) {
        cell.scale.setScalar(config.hoverScale);
        cell.userData.originalScale = config.hoverScale;
      }
    }
  }

  function selectCell(index) {
    if (gameState.matchedCells.includes(index) || 
        gameState.selectedCells.includes(index) ||
        gameState.selectedCells.length >= 2) {
      return null;
    }

    const cell = cellObjects[index];
    const gridColor = gameState.grid[index].color;
    
    if (!cell) return null;

    // Selection animation
    cell.userData.isSelected = true;
    cell.position.z = 0.5;
    cell.rotation.x = Math.PI * 0.1;
    
    gameState.selectedCells.push(index);
    gameState.moves++;
    
    // Check for match
    if (gameState.selectedCells.length === 2) {
      const [firstIndex, secondIndex] = gameState.selectedCells;
      const firstColor = gameState.grid[firstIndex].color;
      const secondColor = gameState.grid[secondIndex].color;
      
      const isMatch = firstColor === secondColor && firstColor === gameState.targetColor;
      
      if (isMatch) {
        // Successful match
        gameState.matchedCells.push(firstIndex, secondIndex);
        gameState.streak++;
        gameState.bestStreak = Math.max(gameState.bestStreak, gameState.streak);
        
        const basePoints = 100 * config.pointsMultiplier;
        const streakBonus = gameState.streak * 25;
        const timeBonus = Math.floor((gameState.timeRemaining / gameState.timeLimit) * 50);
        
        gameState.score += basePoints + streakBonus + timeBonus;
        
        // Match animation
        cellObjects[firstIndex].userData.isMatched = true;
        cellObjects[secondIndex].userData.isMatched = true;
        
        // Update target color
        const nextUnmatched = gameState.grid.find(cell => 
          !gameState.matchedCells.includes(cell.index)
        );
        if (nextUnmatched) {
          gameState.targetColor = nextUnmatched.color;
        }
        
        return { isMatch: true, gameCompleted: gameState.matchedCells.length === gameState.grid.length };
      } else {
        // Failed match
        gameState.streak = 0;
        return { isMatch: false };
      }
    }
    
    gameState.accuracy = gameState.matchedCells.length / (gameState.moves * 0.5);
    
    return { isMatch: undefined };
  }

  function clearSelection() {
    gameState.selectedCells.forEach(index => {
      const cell = cellObjects[index];
      if (cell && !cell.userData.isMatched) {
        cell.userData.isSelected = false;
        cell.position.z = 0;
        cell.rotation.x = 0;
      }
    });
    gameState.selectedCells = [];
  }

  function updateTime() {
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - lastUpdateTime) / 1000);
    
    if (elapsedSeconds >= 1) {
      gameState.timeRemaining = Math.max(0, gameState.timeRemaining - elapsedSeconds);
      lastUpdateTime = currentTime;
      
      if (gameState.timeRemaining <= 0) {
        return true; // Time's up
      }
    }
    
    return false;
  }

  function update() {
    rotationAngle += config.rotationSpeed;
    
    // Gentle rotation animation
    cellObjects.forEach((cell, index) => {
      if (!cell.userData.isMatched && !cell.userData.isSelected) {
        const time = Date.now() * 0.001;
        const row = Math.floor(index / config.gridSize);
        const col = index % config.gridSize;
        
        cell.rotation.y = rotationAngle + Math.sin(time + row + col) * 0.1;
        cell.rotation.x = Math.cos(time + row) * 0.05;
        
        // Pulsing glow for unmatched cells
        const glow = cell.children[1];
        if (glow) {
          glow.material.opacity = 0.1 + Math.sin(time * 2 + index) * 0.05;
        }
      } else if (cell.userData.isMatched) {
        // Celebration animation for matched cells
        cell.rotation.y += 0.03;
        cell.position.z = 0.2 + Math.sin(Date.now() * 0.005) * 0.1;
        
        const glow = cell.children[1];
        if (glow) {
          glow.material.color.setHSL((Date.now() * 0.001) % 1, 0.8, 0.6);
          glow.material.opacity = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
        }
      }
    });
  }

  function getGameState() {
    return { ...gameState };
  }

  function destroy() {
    cellObjects.forEach(cell => {
      if (cell.geometry) cell.geometry.dispose();
      if (cell.material) {
        if (Array.isArray(cell.material)) {
          cell.material.forEach(material => material.dispose());
        } else {
          cell.material.dispose();
        }
      }
      cell.children.forEach(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    });
  }

  // Initialize the game
  init();

  return {
    selectCell,
    setHoveredCell,
    updateTime,
    update,
    getGameState,
    clearSelection,
    destroy
  };
}