"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

interface FadeInProps {
	children: ReactNode;
	delay?: number;
	duration?: number;
	direction?: "up" | "down" | "left" | "right" | "none";
	className?: string;
	amount?: number;
}

/**
 * FadeIn 动画组件 - 统一的进场动画解决方案
 * 使用 Intersection Observer API 实现视口内动画，避免抖动
 */
export function FadeIn({
	children,
	delay = 0,
	duration = 600,
	direction = "up",
	className = "",
	amount = 0.3,
}: FadeInProps) {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					// 一旦可见就停止观察，避免重复触发
					observer.unobserve(entry.target);
				}
			},
			{
				threshold: amount,
				rootMargin: "0px 0px -50px 0px",
			},
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [amount]);

	// 根据方向计算初始位置
	const getTransform = () => {
		if (!isVisible) {
			switch (direction) {
				case "up":
					return "translateY(24px)";
				case "down":
					return "translateY(-24px)";
				case "left":
					return "translateX(24px)";
				case "right":
					return "translateX(-24px)";
				default:
					return "none";
			}
		}
		return "translate(0)";
	};

	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: isVisible ? 1 : 0,
				transform: getTransform(),
				transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
				willChange: "opacity, transform",
			}}
		>
			{children}
		</div>
	);
}

/**
 * 交错动画容器 - 为子元素添加递增延迟
 */
export function StaggerContainer({
	children,
	staggerDelay = 100,
	className = "",
}: {
	children: ReactNode;
	staggerDelay?: number;
	className?: string;
}) {
	const childArray = Array.isArray(children) ? children : [children];

	return (
		<div className={className}>
			{childArray.map((child, index) => (
				<FadeIn key={index} delay={index * staggerDelay}>
					{child}
				</FadeIn>
			))}
		</div>
	);
}
