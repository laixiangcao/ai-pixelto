"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";

export const ParticleBackground: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}

		let animationFrameId: number;
		let particles: Particle[] = [];

		// Mouse interaction variables
		let mouseX = 0;
		let mouseY = 0;

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX - window.innerWidth / 2;
			mouseY = e.clientY - window.innerHeight / 2;
		};
		window.addEventListener("mousemove", handleMouseMove);

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			initParticles();
		};
		window.addEventListener("resize", resize);

		class Particle {
			x: number;
			y: number;
			z: number;
			color: string;
			lengthMultiplier: number;

			constructor(w: number, h: number, theme: string) {
				// Random initial position in 3D space
				this.x = (Math.random() - 0.5) * w * 3;
				this.y = (Math.random() - 0.5) * h * 3;
				this.z = Math.random() * w;

				// Theme-adapted colors
				let colors: string[];

				if (theme === "dark") {
					// Dark Mode: Blue/White/Zinc (Space/Warp)
					colors = [
						"#60a5fa", // Blue 400
						"#3b82f6", // Blue 500
						"#93c5fd", // Blue 300
						"#ffffff", // White
						"#a1a1aa", // Zinc 400
					];
				} else {
					// Light Mode: Orange/Purple/Pink (Vibrant/Warm)
					colors = [
						"#f97316", // Orange 500
						"#ec4899", // Pink 500
						"#8b5cf6", // Violet 500
						"#fbbf24", // Amber 400
						"#71717a", // Zinc 500
					];
				}

				this.color = colors[Math.floor(Math.random() * colors.length)];
				this.lengthMultiplier = Math.random() * 0.5 + 0.5;
			}

			update(w: number, h: number, speed: number) {
				this.z -= speed;
				// Respawn when it passes the camera
				if (this.z <= 0) {
					this.z = w;
					this.x = (Math.random() - 0.5) * w * 2;
					this.y = (Math.random() - 0.5) * h * 2;
				}
			}

			draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
				const cx = w / 2;
				const cy = h / 2;

				// Subtle parallax effect
				const offsetX = mouseX * 0.05;
				const offsetY = mouseY * 0.05;

				// 3D Perspective Projection
				const scale = w / this.z;
				const sx = cx + (this.x - offsetX) * scale;
				const sy = cy + (this.y - offsetY) * scale;

				// Culling for performance
				if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
					return;
				}

				// Calculate size and length based on depth (closer = larger)
				const size = (1 - this.z / w) * 2.5;
				const length = size * 20 * this.lengthMultiplier;

				// Calculate angle so dash points away from the center (warp effect)
				const angle = Math.atan2(sy - cy, sx - cx);

				ctx.save();
				ctx.translate(sx, sy);
				ctx.rotate(angle);
				ctx.fillStyle = this.color;
				ctx.beginPath();
				// Draw the particle as a rounded dash
				if (ctx.roundRect) {
					ctx.roundRect(0, -size / 2, length, size, size);
				} else {
					ctx.rect(0, -size / 2, length, size);
				}
				ctx.fill();
				ctx.restore();
			}
		}

		const initParticles = () => {
			particles = [];
			const w = canvas.width;
			const h = canvas.height;
			// Adjust particle count based on screen size
			const count = window.innerWidth < 768 ? 150 : 400;
			const currentTheme = resolvedTheme || "dark"; // Default to dark if undefined

			for (let i = 0; i < count; i++) {
				particles.push(new Particle(w, h, currentTheme));
			}
		};

		resize();

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Sort by Z to draw distant particles first (better for layering)
			particles.sort((a, b) => b.z - a.z);

			const speed = 5; // Speed of the warp effect

			particles.forEach((p) => {
				p.update(canvas.width, canvas.height, speed);
				p.draw(ctx, canvas.width, canvas.height);
			});

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(animationFrameId);
		};
	}, [resolvedTheme]); // Re-run when theme changes

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 pointer-events-none"
			style={{ zIndex: 0 }}
		/>
	);
};
