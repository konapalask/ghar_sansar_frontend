// src/context/InteriorContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface InteriorWork {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  description?: string;
  image?: string;
}

interface InteriorContextType {
  works: InteriorWork[];
  addWork: (work: InteriorWork) => void;
  updateWork: (work: InteriorWork) => void;
  deleteWork: (id: number) => void;
}

const InteriorContext = createContext<InteriorContextType | undefined>(undefined);

/** ✅ Raw categories with subcategories (your format) */
const rawCategories = [
  {
    name: "Wallpaper Rolls",
    image: "/interior/wallpaper_rolls/1.jpg",
    subcategories: [
      { name: "Classic Floral", image: "/interior/wallpaper_rolls/1.jpg" },
      { name: "Modern Patterns", image: "/interior/wallpaper_rolls/2.jpg" },
      { name: "Kids Theme", image: "/interior/wallpaper_rolls/13.jpg" },
      { name: "Textured", image: "/interior/wallpaper_rolls/3.jpeg" },
      { name: "Geometric", image: "/interior/wallpaper_rolls/4.jpg" },
      { name: "Nature Inspired", image: "/interior/wallpaper_rolls/5.jpg" },
      { name: "Abstract", image: "/interior/wallpaper_rolls/6.jpg" },
      { name: "Metallic Finish", image: "/interior/wallpaper_rolls/7.jpg" },
      { name: "Vintage", image: "/interior/wallpaper_rolls/8.jpg" },
      { name: "Contemporary", image: "/interior/wallpaper_rolls/9.jpg" },
      { name: "Themed Designs", image: "/interior/wallpaper_rolls/10.jpg" },
      { name: "Custom Prints", image: "/interior/wallpaper_rolls/11.jpg" },
      { name: "3D Effect", image: "/interior/wallpaper_rolls/12.jpg" },
      { name: "Striped", image: "/interior/wallpaper_rolls/13.jpg" },
      { name: "Damask", image: "/interior/wallpaper_rolls/14.webp" },
      { name: "Floral", image: "/interior/wallpaper_rolls/15.jpg" },
      { name: "Kids Theme", image: "/interior/wallpaper_rolls/16.jpg" },
      { name: "Mural", image: "/interior/wallpaper_rolls/17.jpg" },
      { name: "Nature Inspired", image: "/interior/wallpaper_rolls/18.jpg" },
      { name: "Patterned", image: "/interior/wallpaper_rolls/19.jpg" },
      { name: "Solid Colors", image: "/interior/wallpaper_rolls/20.jpg" },
      { name: "Textured", image: "/interior/wallpaper_rolls/21.webp" },
      { name: "Tropical", image: "/interior/wallpaper_rolls/22.webp" },
      { name: "Vintage", image: "/interior/wallpaper_rolls/23.jpg" },
      { name: "Woodland", image: "/interior/wallpaper_rolls/24.jpg" },

    ],
    features: ["Variety of designs", "Easy installation"],
  },
  {
    name: "Wallpapers",
    image: "/interior/wallpaper/bokka.jpg",
    subcategories: [
      { name: "Floral Wallpapers", image: "/interior/wallpaper/1.jpeg" },
      { name: "Geometric Wallpapers", image: "/interior/wallpaper/2.jpeg" },
      { name: "Textured Wallpapers", image: "/interior/wallpaper/3.jpeg" },
      { name: "Nature Wallpapers", image: "/interior/wallpaper/4.jpeg" },
      { name: "Abstract Wallpapers", image: "/interior/wallpaper/5.jpeg" },
      { name: "Metallic Wallpapers", image: "/interior/wallpaper/6.jpeg" },
      { name: "Vintage Wallpapers", image: "/interior/wallpaper/7.jpeg" },
      { name: "Contemporary Wallpapers", image: "/interior/wallpaper/8.jpeg" },
      { name: "Themed Wallpapers", image: "/interior/wallpaper/9.jpeg" },
      { name: "Custom Wallpapers", image: "/interior/wallpaper/10.jpeg" },
      { name: "3D Effect Wallpapers", image: "/interior/wallpaper/11.jpeg" },
      { name: "Striped Wallpapers", image: "/interior/wallpaper/12.jpeg" },
      { name: "Damask Wallpapers", image: "/interior/wallpaper/13.jpeg" },
      
    ],
    features: ["Decorative", "Wide selection"],
  },
  {
    name: "3d wallpapers",
    image: "/interior/3dbokka/2.jpeg",
    subcategories: [
      { name: "Blackout Curtains", image: "/interior/3dbokka/1.jpg" },
      { name: "Sheer Curtains", image: "/interior/3dbokka/3.jpeg" },
      { name: "Thermal Curtains", image: "/interior/3dbokka/4.jpeg" },
      { name: "Patterned Curtains", image: "/interior/3dbokka/5.jpeg" },
      { name: "Solid Color Curtains", image: "/interior/3dbokka/6.jpeg" },
      { name: "Velvet Curtains", image: "/interior/3dbokka/7.jpeg" },
      { name: "Linen Curtains", image: "/interior/3dbokka/8.jpeg" },
      { name: "Silk Curtains", image: "/interior/3dbokka/9.webp" },
      { name: "Cotton Curtains", image: "/interior/3dbokka/10.webp" },
      { name: "Embroidered Curtains", image: "/interior/3dbokka/11.webp" },
      { name: "Grommet Curtains", image: "/interior/3dbokka/12.jpg" },
      { name: "Rod Pocket Curtains", image: "/interior/3dbokka/13.jpg" },
     
      
    ],
    features: ["Light control", "Privacy"],
  },
    {
    name: "WALL ART AFFECTS",
    image: "/interior/wallart/8.webp",
    subcategories: [
      { name: "Blackout Curtains", image: "/interior/wallart/1.webp" },
      { name: "Sheer Curtains", image: "/interior/wallart/2.webp" },
      { name: "Thermal Curtains", image: "/interior/wallart/3.webp" },
      { name: "Patterned Curtains", image: "/interior/wallart/4.webp" },
      { name: "Solid Color Curtains", image: "/interior/3dbokka/5.webp" },
      { name: "Velvet Curtains", image: "/interior/3dbokka/6.avif" },
      { name: "Linen Curtains", image: "/interior/3dbokka/7.jpg" },
      { name: "Silk Curtains", image: "/interior/3dbokka/9.jpg" },
      { name: "Cotton Curtains", image: "/interior/3dbokka/10.webp" },
      
     
      
    ],
    features: ["Light control", "Privacy"],
  },
{
    name: "Vinyl Flooring",
    image: "/interior/vinyl_flooring/1.jpg",
    subcategories: [
      { name: "Wood Finish", image: "/interior/vinyl_flooring/2.avif" },
      { name: "Stone Finish", image: "/interior/vinyl_flooring/3.jpg" },
      { name: "Patterned Vinyl", image: "/interior/vinyl_flooring/4.jpg"},
      { name: "Solid Color", image: "/interior/vinyl_flooring/5.jpg"},
      { name: "Textured Vinyl", image: "/interior/vinyl_flooring/6.jpg"},
      { name: "Luxury Vinyl Plank", image: "/interior/vinyl_flooring/7.jpg"},
      { name: "Waterproof Vinyl", image: "/interior/vinyl_flooring/8.jpeg"},
      { name: "Commercial Vinyl", image: "/interior/vinyl_flooring/9.jpg"},
      { name: "Residential Vinyl", image: "/interior/vinyl_flooring/10.jpg"},
      { name: "Eco-friendly Vinyl", image: "/interior/vinyl_flooring/11.jpg"},
      { name: "Outdoor Vinyl", image: "/interior/vinyl_flooring/12.jpg"},
      { name: "Custom Vinyl", image: "/interior/vinyl_flooring/13.webp"},
      
      
    ],
    features: ["Durable", "Easy to clean"],
  },
  {
    name: "Natural Vertical Garden",
    image: "/interior/maddalo_garden/1.jpg",
    subcategories: [
      { name: "Indoor Vertical Garden", image: "/interior/maddalo_garden/2.jpg" },
      { name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/3.jpg" },
         { name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/4.jpg" },
            { name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/5.jpg" },
               { name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/6.jpg" },
                  { name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/7.jpg" },
                     { name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/8.jpg" },
                        { name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/9.jpeg" },
                           { name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/10.jpg" },
                              { name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/11.webp" },
{ name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/12.jpg" },
{ name: "Outdoor Vertical Garden", image: "/interior/maddalo_garden/13.jpg" },
        
    ],
    features: ["Space saving", "Natural plants"],
  },
  {
    name: "Blinds",
    image: "/interior/blinds/2.jpg",
    subcategories: [
      { name: "Venetian Blinds", image: "/interior/blinds/1.jpg" },
      { name: "Roller Blinds", image: "/interior/blinds/3.jpeg" },
      { name: "Vertical Blinds", image: "/interior/blinds/4.jpeg" },
      { name: "Roman Blinds", image: "/interior/blinds/5.jpeg "},
      { name: "Panel Blinds", image: "/interior/blinds/6.jpeg" },
      { name: "Pleated Blinds", image: "/interior/blinds/7.jpeg" },
      { name: "Cellular Blinds", image: "/interior/blinds/8.jpg" },
      { name: "Sheer Blinds", image: "/interior/blinds/9.jpg" },
      { name: "Wooden Blinds", image: "/interior/blinds/10.jpeg" },

      
      { name: "Outdoor Blinds", image: "/interior/blinds/11.jpg" },
      { name: "Custom Blinds", image: "/interior/blinds/12.jpg" },
      
    ],
    features: ["Adjustable light", "Privacy"],
  },
  {
    name: "Automation Motorised Blinds",
    image: "/interior/automised_blind/1.jpg",
    subcategories: [
      { name: "Remote Blinds", image: "/interior/automised_blind/2.jpg" },
      { name: "Smart Blinds", image: "/interior/automised_blind/3.jpg" },
      { name: "Smart Blinds", image: "/interior/automised_blind/4.jpg"  },
         { name: "Smart Blinds", image: "/interior/automised_blind/5.jpg"  },
            { name: "Smart Blinds", image: "/interior/automised_blind/6.jpg"  },
               { name: "Smart Blinds", image: "/interior/automised_blind/7.jpg"  },
                 { name: "Smart Blinds", image: "/interior/automised_blind/8.jpeg"  },
                 { name: "Smart Blinds", image: "/interior/automised_blind/9.jpg"  },
                 { name: "Smart Blinds", image: "/interior/automised_blind/10.jpeg"  },
    ],
    features: ["Remote control", "Smart technology"],
  },
  {
    name: "Gym Flooring",
    image: "/interior/gym flooring/1.jpg",
    subcategories: [
      { name: "Rubber Tiles", image: "/interior/gym flooring/2.png" },
      { name: "Puzzle Mats", image: "/interior/gym flooring/3.jpg" },
       { name: "Puzzle Mats", image: "/interior/gym flooring/4.jpg" },
        { name: "Puzzle Mats", image: "/interior/gym flooring/5.jpg" },
         { name: "Puzzle Mats", image: "/interior/gym flooring/6.jpg" },
          { name: "Puzzle Mats", image: "/interior/gym flooring/7.jpg" },
          { name: "Puzzle Mats", image: "/interior/gym flooring/8.jpg" },
          { name: "Puzzle Mats", image: "/interior/gym flooring/9.jpg" },
          { name: "Puzzle Mats", image: "/interior/gym flooring/10.jpg" },
{ name: "Puzzle Mats", image: "/interior/gym flooring/11.jpg" },
{ name: "Puzzle Mats", image: "/interior/gym flooring/12.jpg" },
{ name: "Puzzle Mats", image: "/interior/gym flooring/13.jpg" },
       

    ],
    features: ["Shock absorbent", "Slip resistant"],
  },
  {
    name: "Artificial Wall Garden",
    image: "/interior/artificial vertical garden/4.jpg",
    subcategories: [
      { name: "Low-maintenance", image: "/interior/artificial vertical garden/2.jpg" },
       { name: "Low-maintenance", image: "/interior/artificial vertical garden/3.jpg" },
        { name: "Low-maintenance", image: "/interior/artificial vertical garden/1.jpg" },
         { name: "Low-maintenance", image: "/interior/artificial vertical garden/5.jpg" },
          { name: "Low-maintenance", image: "/interior/artificial vertical garden/6.jpg" },
           { name: "Low-maintenance", image: "/interior/artificial vertical garden/7.jpg" },
            { name: "Low-maintenance", image: "/interior/artificial vertical garden/8.jpg" },
             { name: "Low-maintenance", image: "/interior/artificial vertical garden/9.jpg" },
              { name: "Low-maintenance", image: "/interior/artificial vertical garden/10.jpg" },
{ name: "Low-maintenance", image: "/interior/artificial vertical garden/11.jpg" },
{ name: "Low-maintenance", image: "/interior/artificial vertical garden/12.jpg" },
{ name: "Low-maintenance", image: "/interior/artificial vertical garden/13.jpg" },
    ],
    features: ["Zero upkeep", "Green look"],
  },
  {
    name: "ICU Flooring",
    image: "/interior/ICU/9.jpg",
    subcategories: [
      { name: "Clean Room Flooring", image: "/interior/ICU/1.webp" },
      { name: "Anti-microbial Flooring", image: "/interior/ICU/2.webp" },
      { name: "Seamless Flooring", image: "/interior/ICU/3.jpg" },
      { name: "Slip-resistant Flooring", image: "/interior/ICU/4.jpg" },
      { name: "Chemical-resistant Flooring", image: "/interior/ICU/5.JPG" },
      { name: "Durable Flooring", image: "/interior/ICU/6.webp" },
      { name: "Easy-to-clean Flooring", image: "/interior/ICU/7.jpg" },
      { name: "Hygienic Flooring", image: "/interior/ICU/8.jpg" },
      { name: "Shock-absorbent Flooring", image: "/interior/ICU/10.jpg" },
      { name: "Waterproof Flooring", image: "/interior/ICU/11.jpeg" },
      { name: "Customizable Flooring", image: "/interior/ICU/12.png" },
      { name: "Eco-friendly Flooring", image: "/interior/ICU/13.webp" },
    ],
    features: ["Hygienic", "Non-slip"],
  },
  {
    name: "Sliding & Metal Door",
    image: "/interior/metaldoor/1.jpg",
    subcategories: [
      { name: "Sliding Doors", image: "/interior/metaldoor/2.jpg" },
      { name: "Metal Doors", image: "/interior/metaldoor/3.jpg" },
      { name: "Metal Doors", image: "/interior/metaldoor/4.avif" },
      { name: "Metal Doors", image: "/interior/metaldoor/5.avif" },
      { name: "Metal Doors", image: "/interior/metaldoor/6.jpg" },
      { name: "Metal Doors", image: "/interior/metaldoor/7.jpg" },
      { name: "Metal Doors", image: "/interior/metaldoor/8.webp" },
      { name: "Metal Doors", image: "/interior/metaldoor/9.webp" },
      { name: "Metal Doors", image: "/interior/metaldoor/10.avif" },
      { name: "Metal Doors", image: "/interior/metaldoor/11.jpg" },
      { name: "Metal Doors", image: "/interior/metaldoor/12.jpg" },
      { name: "Metal Doors", image: "/interior/metaldoor/13.avif" },
    ],
    features: ["Space efficient", "Modern finish"],
  },
  {
    name: "Invisible Grill",
    image: "/interior/invisible_blinds/13.png",
    subcategories: [
      { name: "Balcony Grill", image: "/interior/invisible_blinds/2.jpeg" },
      {name: "Balcony Grill", image: "/interior/invisible_blinds/4-1.webp" },
      {name: "Balcony Grill", image: "/interior/invisible_blinds/5.webp" },

          
              { name: "Balcony Grill", image: "/interior/invisible_blinds/3.jpg" },
                  { name: "Balcony Grill", image: "/interior/invisible_blinds/4.jpg" },
                     
                          { name: "Balcony Grill", image: "/interior/invisible_blinds/6.jpeg" },
                              { name: "Balcony Grill", image: "/interior/invisible_blinds/7.jpg" },
                                  { name: "Balcony Grill", image: "/interior/invisible_blinds/8.webp" },
                                      { name: "Balcony Grill", image: "/interior/invisible_blinds/9.jpeg" },
 { name: "Balcony Grill", image: "/interior/invisible_blinds/10.jpg" },
  { name: "Balcony Grill", image: "/interior/invisible_blinds/11.jpg" },
   { name: "Balcony Grill", image: "/interior/invisible_blinds/12.jpg" },
  { name: "Balcony Grill", image: "/interior/invisible_blinds/1.jpg" },
    ],
    features: ["Safe", "Transparent"],
  },
  {
    name: "EPDM Flooring",
    image: "/interior/EPDM/1.jpg",
    subcategories: [
      { name: "Colorful EPDM", image: "/interior/EPDM/2.webp" },
      { name: "Colorful EPDM", image: "/interior/EPDM/3.jpeg" },
      { name: "Colorful EPDM", image: "/interior/EPDM/4.jpg" },
      { name: "Colorful EPDM", image: "/interior/EPDM/5.jpeg" },
      { name: "Colorful EPDM", image: "/interior/EPDM/6.jpg" },
      { name: "Colorful EPDM", image: "/interior/EPDM/7.jpg" },
      { name: "Colorful EPDM", image: "/interior/EPDM/8.jpeg" },
      { name: "Colorful EPDM", image: "/interior/EPDM/9.webp" },
      { name: "Colorful EPDM", image: "/interior/EPDM/10.jpg" },
    
    ],
    features: ["Colorful", "Shockproof"],
  },
  {
    name: "Bubble Fountain",
    image: "/interior/buuble fountain/14.jpg",
    subcategories: [
      { name: "Indoor Fountain", image: "/interior/buuble fountain/1.jpg" },
          { name: "Indoor Fountain", image: "/interior/buuble fountain/3.jpg" },
              { name: "Indoor Fountain", image: "/interior/buuble fountain/4.jpg" },
                  { name: "Indoor Fountain", image: "/interior/buuble fountain/5.jpeg" },
    { name: "Indoor Fountain", image: "/interior/buuble fountain/6.jpg" },
        { name: "Indoor Fountain", image: "/interior/buuble fountain/7.jpg" },
            { name: "Indoor Fountain", image: "/interior/buuble fountain/8.jpg" },
                { name: "Indoor Fountain", image: "/interior/buuble fountain/9.jpg" },
                    { name: "Indoor Fountain", image: "/interior/buuble fountain/10.jpg" },
                        { name: "Indoor Fountain", image: "/interior/buuble fountain/11.jpg" },
                        { name: "Indoor Fountain", image: "/interior/buuble fountain/12.jpg" },
{ name: "Indoor Fountain", image: "/interior/buuble fountain/13.jpg" },
{ name: "Indoor Fountain", image: "/interior/buuble fountain/14.jpg" },
{ name: "Indoor Fountain", image: "/interior/buuble fountain/15.webp" },
{ name: "Indoor Fountain", image: "/interior/buuble fountain/16.jpg" },
{ name: "Indoor Fountain", image: "/interior/buuble fountain/17.jpg" },
{ name: "Indoor Fountain", image: "/interior/buuble fountain/18.avif" },

                
                           
            
    ],
    features: ["Decorative", "Indoor use"],
  },
  {
    name: "Terrace & Outdoor Gardening",
    image: "/interior/terrace_garden/1.jpeg",
    subcategories: [
      { name: "Landscaping", image: "/interior/terrace_garden/2.jpg" },
      { name: "Patio Design", image: "/interior/terrace_garden/3.webp" },
      { name: "Garden Lighting", image: "/interior/terrace_garden/4.jpg" },
      { name: "Water Features", image: "/interior/terrace_garden/5.webp" },
      { name: "Outdoor Seating", image: "/interior/terrace_garden/6.jpg" },
      { name: "Pergolas", image: "/interior/terrace_garden/7.avif" },
      { name: "Fire Pits", image: "/interior/terrace_garden/8.jpg" },
      { name: "Garden Pathways", image: "/interior/terrace_garden/9.jpg" },
      { name: "Vertical Gardens", image: "/interior/terrace_garden/10.jpg" },
      
    ],
    features: ["Greenery", "Custom layouts"],
  },
  {
    name: "Canopy",
    image: "interior/canopy/1.jpg",
    subcategories: [
      { name: "Entrance Canopy", image: "interior/canopy/2.jpg" },
      { name: "Patio Canopy", image: "interior/canopy/3.jpg" },
      { name: "Carport Canopy", image: "interior/canopy/4.webp" },
      { name: "Poolside Canopy", image: "interior/canopy/5.jpg" },
      { name: "Garden Canopy", image: "interior/canopy/6.jpg" },
      { name: "Retractable Canopy", image: "interior/canopy/7.jpg" },
      { name: "Shade Sail", image: "interior/canopy/8.jpg" },
      { name: "Outdoor Canopy", image: "interior/canopy/9.avif" },
      { name: "Custom Canopy", image: "interior/canopy/10.jpg" },
    ],
    features: ["Weather protection", "Aesthetic appeal"],
  },
  {
    name: "Wooden Flooring",
    image: "interior/woodfloor/1.jpg",
    subcategories: [
      { name: "Laminate Wood", image: "interior/woodfloor/2.jpg" },
      { name: "Engineered Wood", image: "interior/woodfloor/3.jpg" },
      { name: "Solid Hardwood", image: "interior/woodfloor/4.webp" },
      { name: "Bamboo Flooring", image: "interior/woodfloor/5.jpg" },
      { name: "Cork Flooring", image: "interior/woodfloor/6.jpg" },
      { name: "Reclaimed Wood", image: "interior/woodfloor/7.jpg" },
      { name: "Parquet Flooring", image: "interior/woodfloor/8.avif" },
      { name: "Wood-look Vinyl", image: "interior/woodfloor/9.webp" },
      { name: "Wood-look Tile", image: "interior/woodfloor/10.webp" },

    ],
    features: ["Warm finish", "Classic look"],
  },
  {
    name: "Ceramic Pots",
    image: "interior/cerpot/1.webp",
    subcategories: [
      { name: "Decorative Pots", image: "interior/cerpot/2.webp" },
      { name: "Decorative Pots", image: "interior/cerpot/3.jpg" },
      { name: "Decorative Pots", image: "interior/cerpot/4.jpg" },
      { name: "Decorative Pots", image: "interior/cerpot/5.jpg" },
      { name: "Decorative Pots", image: "interior/cerpot/6.avif" },
      { name: "Decorative Pots", image: "interior/cerpot/7.webp" },
      { name: "Decorative Pots", image: "interior/cerpot/8.webp" },
      { name: "Decorative Pots", image: "interior/cerpot/9.avif" },
      { name: "Decorative Pots", image: "interior/cerpot/10.webp" },
      
      
    ],
    features: ["Elegant", "For plants"],
  },
  {
    name: "Artificial Lawn",
    image: "interior/lawn/2.jpg",
    subcategories: [
      { name: "Decorative Pots", image: "interior/lawn/1.jpg" },
      { name: "Decorative Pots", image: "interior/lawn/3.jpg" },
      { name: "Decorative Pots", image: "interior/lawn/4.jpg" },
      { name: "Decorative Pots", image: "interior/lawn/5.jpg" },
      { name: "Decorative Pots", image: "interior/lawn/6.jpg" },
      { name: "Decorative Pots", image: "interior/lawn/7.webp" },
      { name: "Decorative Pots", image: "interior/lawn/8.webp" },
      { name: "Decorative Pots", image: "interior/lawn/9.jpg" },
      { name: "Decorative Pots", image: "interior/lawn/10.webp" },
    ],
    features: ["Low maintenance", "Lush look"],
  },
  {
    name: "Outdoor Deck Benches",
    image: "interior/bench/1.jpg",
    subcategories: [
      { name: "Benches", image: "interior/bench/2.jpg" },
      { name: "Benches", image: "interior/bench/3.webp" },
      { name: "Benches", image: "interior/bench/4.jpg" },
      { name: "Benches", image: "interior/bench/5.jpg" },
      { name: "Benches", image: "interior/bench/6.jpg" },
      { name: "Benches", image: "interior/bench/7.webp" },
      { name: "Benches", image: "interior/bench/8.png" },
      { name: "Benches", image: "interior/bench/9.jpg" },
      { name: "Benches", image: "interior/bench/10.jpg" },
    ],
    features: ["Outdoor seating", "Durable"],
  },
  {
    name: "Customised Water Fountain",
    image: "interior/fountain/1.jpg",
    subcategories: [
      { name: "Designer Fountain", image: "interior/fountain/2.jpg" },
      { name: "Designer Fountain", image: "interior/fountain/3.avif" },
      { name: "Designer Fountain", image: "interior/fountain/4.jpg" },
      { name: "Designer Fountain", image: "interior/fountain/5.jpg" },
      { name: "Designer Fountain", image: "interior/fountain/6.jpg" },
      { name: "Designer Fountain", image: "interior/fountain/7.jpg" },
      { name: "Designer Fountain", image: "interior/fountain/8.jpg" },
      { name: "Designer Fountain", image: "interior/fountain/9.webp" },
      { name: "Designer Fountain", image: "interior/fountain/10.jpg" },
    ],
    features: ["Unique designs", "Outdoor/indoor"],
  },
  {
    name: "HDP Planter Pots",
    image: "interior/HDP/1.webp",
    subcategories: [
      { name: "Weatherproof Pots", image: "interior/HDP/2.jpg" },
      { name: "Weatherproof Pots", image: "interior/HDP/3.webp" },
      { name: "Weatherproof Pots", image: "interior/HDP/4.webp" },
      { name: "Weatherproof Pots", image: "interior/HDP/5.webp" },
      { name: "Weatherproof Pots", image: "interior/HDP/6.avif" },
      { name: "Weatherproof Pots", image: "interior/HDP/7.webp" },
      { name: "Weatherproof Pots", image: "interior/HDP/8.png" },
      { name: "Weatherproof Pots", image: "interior/HDP/9.avif" },
      { name: "Weatherproof Pots", image: "interior/HDP/11.jpg" },
    ],
    features: ["Durable", "Modern look"],
  },
  {
    name: "Pigeon Net",
    image: "interior/net/1.jpg",
    subcategories: [
      { name: "Safety Net", image: "interior/net/2.jpg" },
      { name: "Safety Net", image: "interior/net/3.jpg" },
      { name: "Safety Net", image: "interior/net/4.jpg" },
      { name: "Safety Net", image: "interior/net/5.jpg" },
      { name: "Safety Net", image: "interior/net/6.webp" },
      { name: "Safety Net", image: "interior/net/7.avif" },
      { name: "Safety Net", image: "interior/net/8.webp" },
      { name: "Safety Net", image: "interior/net/9.jpg" },
      { name: "Safety Net", image: "interior/net/10.jpg" },
    ],
    features: ["Bird protection", "Transparent"],
  },
  {
    name: "Curtains",
    image: "interior/curtain/1.webp",
    subcategories: [
      { name: "Safety Net", image: "interior/curtain/3.webp" },
      { name: "Safety Net", image: "interior/curtain/2.avif" },
      { name: "Safety Net", image: "interior/curtain/4.webp" },
      { name: "Safety Net", image: "interior/curtain/5.jpg" },
      { name: "Safety Net", image: "interior/curtain/6.webp" },
      { name: "Safety Net", image: "interior/curtain/7.jpg" },
      { name: "Safety Net", image: "interior/curtain/8.avif" },
      { name: "Safety Net", image: "interior/curtain/9.webp" },
      { name: "Safety Net", image: "interior/curtain/10.webp" },
    ],
    features: ["Premium Fabrics", "Elegant. Functional."],
  },
  {
    name: "Office room carpets",
    image: "interior/ofc/1.webp",
    subcategories: [
      { name: "Safety Net", image: "interior/ofc/2.avif" },
      { name: "Safety Net", image: "interior/ofc/3.webp" },
      { name: "Safety Net", image: "interior/ofc/4.jpg" },
      { name: "Safety Net", image: "interior/ofc/5.jpg" },
      { name: "Safety Net", image: "interior/ofc/6.png" },
      { name: "Safety Net", image: "interior/ofc/7.jpg" },
      { name: "Safety Net", image: "interior/ofc/8.jpg" },
      { name: "Safety Net", image: "interior/ofc/9.jpg" },
      { name: "Safety Net", image: "interior/ofc/10.jpg" },
    ],
    features: ["Noise Reduction ", "Spill & Stain Resistant"],
  },
{
    name: "Cloth Dry Well",
    image: "interior/dry/1.jpg",
    subcategories: [
      { name: "Safety Net", image: "interior/dry/2.JPG" },
      { name: "Safety Net", image: "interior/dry/3.webp" },
      { name: "Safety Net", image: "interior/dry/4.jpg" },
      { name: "Safety Net", image: "interior/dry/5.jpg" },
      { name: "Safety Net", image: "interior/dry/6.jpg" },
      { name: "Safety Net", image: "interior/dry/7.jpg" },
      { name: "Safety Net", image: "interior/dry/8.webp" },
   
    ],
    features: [" Weather-Protected Drying", "Bird & Dust Proof"],
  },
{
    name: "Sky Light Blinds",
    image: "interior/sky/1.jpg",
    subcategories: [
      { name: "Safety Net", image: "interior/sky/2.jpg" },
      { name: "Safety Net", image: "interior/sky/3.jpeg" },
      { name: "Safety Net", image: "interior/sky/4.webp" },
      { name: "Safety Net", image: "interior/sky/5.webp" },
      { name: "Safety Net", image: "interior/sky/6.jpg" },
      { name: "Safety Net", image: "interior/sky/7.jpg" },
      { name: "Safety Net", image: "interior/sky/8.avif" },
      { name: "Safety Net", image: "interior/sky/9.jpg" },
      { name: "Safety Net", image: "interior/sky/10.jpg" },
   
    ],
    features: ["Light Control", " UV Resistant","Bird-Safe "],
  },
  {
    name: "PERGOLA",
    image: "interior/pergola/1.jpg",
    subcategories: [
      { name: "Safety Net", image: "interior/pergola/2.jpg" },
      { name: "Safety Net", image: "interior/pergola/3.jpg" },
      { name: "Safety Net", image: "interior/pergola/4.jpg" },
      { name: "Safety Net", image: "interior/pergola/5.jpg" },
      { name: "Safety Net", image: "interior/pergola/6.jpg" },
      { name: "Safety Net", image: "interior/pergola/7.jpg" },
      { name: "Safety Net", image: "interior/pergola/8.jpg" },
      { name: "Safety Net", image: "interior/pergola/9.webp" },
      { name: "Safety Net", image: "interior/pergola/10.webp" },
   
    ],
    features: ["Semi-Open Roofing", "Bird & Sun Protection"],
  },
   {
    name: "Wall and Ceiling Panels",
    image: "interior/wall/1.avif",
    subcategories: [
      { name: "Safety Net", image: "interior/wall/2.jpg" },
      { name: "Safety Net", image: "interior/wall/3.jpg" },
      { name: "Safety Net", image: "interior/wall/4.webp" },
      { name: "Safety Net", image: "interior/wall/5.jpg" },
      { name: "Safety Net", image: "interior/wall/6.webp" },
      { name: "Safety Net", image: "interior/wall/7.jpg" },
      { name: "Safety Net", image: "interior/wall/8.webp" },
      { name: "Safety Net", image: "interior/wall/9.jpg" },
      { name: "Safety Net", image: "interior/wall/10.jpg" },
   
    ],
    features: ["Transparent or Decorative", "Shatter-resistant"],
  },
  {
    name: "Mosquito Doors & Windows",
    image: "interior/mos/1.jpeg",
    subcategories: [
      { name: "Safety Net", image: "interior/mos/2.jpg" },
      { name: "Safety Net", image: "interior/mos/3.jpg" },
      { name: "Safety Net", image: "interior/mos/4.webp" },
      { name: "Safety Net", image: "interior/mos/5.jpg" },
      { name: "Safety Net", image: "interior/mos/6.jpg" },
      { name: "Safety Net", image: "interior/mos/7.avif" },
      { name: "Safety Net", image: "interior/mos/8.jpg" },
      { name: "Safety Net", image: "interior/mos/9.jpg" },
      { name: "Safety Net", image: "interior/mos/10.jpg" },
      
   
    ],
    features: ["Insect Protection ", "Durable","rust-proof frames"],
  },
   {
    name: "Hospital Curtains",
    image: "interior/hosp/1.jpg",
    subcategories: [
      { name: "Safety Net", image: "interior/hosp/2.avif" },
      { name: "Safety Net", image: "interior/hosp/3.jpg" },
      { name: "Safety Net", image: "interior/hosp/4.jpg" },
      { name: "Safety Net", image: "interior/hosp/5.jpg" },
      { name: "Safety Net", image: "interior/hosp/6.jpg" },
      { name: "Safety Net", image: "interior/hosp/7.jpg" },
      { name: "Safety Net", image: "interior/hosp/8.jpg" },
      { name: "Safety Net", image: "interior/hosp/9.jpg" },
      { name: "Safety Net", image: "interior/hosp/10.webp" },
      
   
    ],
    features: ["Hygienic, Transparent Options", " flame-retardant (hospital grade)"],
  },
  {
    name: "Customised Aquariums",
    image: "interior/acq/1.webp",
    subcategories: [
      { name: "Safety Net", image: "interior/acq/2.jpg" },
      { name: "Safety Net", image: "interior/acq/3.jpg" },
      { name: "Safety Net", image: "interior/acq/4.webp" },
      { name: "Safety Net", image: "interior/acq/5.webp" },
      { name: "Safety Net", image: "interior/acq/6.avif" },
      { name: "Safety Net", image: "interior/acq/7.jpg" },
      { name: "Safety Net", image: "interior/acq/8.webp" },
      { name: "Safety Net", image: "interior/acq/9.jpg" },
      { name: "Safety Net", image: "interior/acq/10.webp" },
      
   
    ],
    features: ["Tailored Sizes & Themes", "Indoor Décor"],
  },
   {
    name: "SOFA COVER",
    image: "interior/sofa/1.jpg",
    subcategories: [
      { name: "Safety Net", image: "interior/sofa/2.webp" },
      { name: "Safety Net", image: "interior/sofa/3.webp" },
      { name: "Safety Net", image: "interior/sofa/4.avif" },
      { name: "Safety Net", image: "interior/sofa/5.jpg" },
      { name: "Safety Net", image: "interior/sofa/6.jpg" },
      { name: "Safety Net", image: "interior/sofa/7.avif" },
      { name: "Safety Net", image: "interior/sofa/8.jpeg" },
      { name: "Safety Net", image: "interior/sofa/9.avif" },
      { name: "Safety Net", image: "interior/sofa/10.jpg" },
      
   
    ],
    features: ["Stretchable", "Washable"],
  },
    {
    name: "Gifting Plants",
    image: "interior/gif/1.webp",
    subcategories: [
      { name: "Safety Net", image: "interior/gif/2.jpg" },
      { name: "Safety Net", image: "interior/gif/3.jpg" },
      { name: "Safety Net", image: "interior/gif/4.webp" },
      { name: "Safety Net", image: "interior/gif/5.jpg" },
      { name: "Safety Net", image: "interior/gif/6.jpg" },
      { name: "Safety Net", image: "interior/gif/7.webp" },
      { name: "Safety Net", image: "interior/gif/8.webp" },
      { name: "Safety Net", image: "interior/gif/9.webp" },
      { name: "Safety Net", image: "interior/gif/10.webp" },
      
   
    ],
    features: ["Air-Purifying", "Ready-to-Gift"],
  },
 {
    name: "All Types of Doormats",
    image: "interior/mats/1.jpg",
    subcategories: [
      { name: "Safety Net", image: "interior/mats/2.jpg" },
      { name: "Safety Net", image: "interior/mats/3.webp" },
      { name: "Safety Net", image: "interior/mats/4.jpg" },
      { name: "Safety Net", image: "interior/mats/5.avif" },
      { name: "Safety Net", image: "interior/mats/6.webp" },
      { name: "Safety Net", image: "interior/mats/7.avif" },
      { name: "Safety Net", image: "interior/mats/8.jpg" },
      { name: "Safety Net", image: "interior/mats/9.jpg" },
      { name: "Safety Net", image: "interior/mats/10.webp" },
      
   
    ],
    features: ["Dirt Trapping", "Indoor/outdoor use"],
  },
  {
    name: "Brass Idols",
    image: "interior/brass/1.webp",
    subcategories: [
      { name: "Safety Net", image: "interior/brass/2.webp" },
      { name: "Safety Net", image: "interior/brass/3.jpeg" },
      { name: "Safety Net", image: "interior/brass/4.webp" },
      { name: "Safety Net", image: "interior/brass/5.webp" },
      { name: "Safety Net", image: "interior/brass/6.png" },
      { name: "Safety Net", image: "interior/brass/7.jpg" },
      { name: "Safety Net", image: "interior/brass/8.webp" },
      { name: "Safety Net", image: "interior/brass/9.webp" },
      { name: "Safety Net", image: "interior/brass/10.webp" },
      
   
    ],
    features: ["traditionally crafted brass idols", "Available in Multiple Sizes"],
  },
  {
    name: "Basket Fruit Packings",
    image: "interior/bas/1.jpg",
    subcategories: [
      { name: "Safety Net", image: "interior/bas/2.jpg" },
      { name: "Safety Net", image: "interior/bas/3.jpg" },
      { name: "Safety Net", image: "interior/bas/4.webp" },
      { name: "Safety Net", image: "interior/bas/5.webp" },
      { name: "Safety Net", image: "interior/bas/6.webp" },
      { name: "Safety Net", image: "interior/bas/7.jpg" },
      { name: "Safety Net", image: "interior/bas/8.webp" },
      { name: "Safety Net", image: "interior/bas/9.jpg" },
      { name: "Safety Net", image: "interior/bas/10.webp" },
      
   
    ],
    features: ["Fresh & Seasonal Fruits ", "Custom Branding Available"],
  },

  
];

/** ✅ Convert rawCategories → InteriorWork[] */
const predefinedWorks: InteriorWork[] = rawCategories.flatMap((cat, catIndex) =>
  cat.subcategories.map((sub, subIndex) => ({
    id: catIndex * 100 + subIndex, // unique but stable ID
    title: sub.name,
    category: cat.name,
    subCategory: sub.name,
    description: cat.features?.join(", "),
    image: sub.image,
  }))
);

/** ✅ Context Provider */
export const InteriorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [works, setWorks] = useState<InteriorWork[]>([]);

  // Load from localStorage OR fallback to predefined
  useEffect(() => {
    const stored = localStorage.getItem("interiorWorks");
    if (stored) {
      setWorks([...predefinedWorks, ...JSON.parse(stored)]);
    } else {
      setWorks(predefinedWorks);
    }
  }, []);

  // Save only dynamic works (not predefined) to localStorage
  useEffect(() => {
    const dynamicWorks = works.filter(w => w.id >= 100000); // IDs above 100000 = user-added
    localStorage.setItem("interiorWorks", JSON.stringify(dynamicWorks));
  }, [works]);

  const addWork = (work: InteriorWork) => {
    const newWork = { ...work, id: Date.now() }; // unique ID
    setWorks([...works, newWork]);
  };

  const updateWork = (work: InteriorWork) =>
    setWorks(works.map((w) => (w.id === work.id ? work : w)));

  const deleteWork = (id: number) =>
    setWorks(works.filter((w) => w.id !== id));

  return (
    <InteriorContext.Provider value={{ works, addWork, updateWork, deleteWork }}>
      {children}
    </InteriorContext.Provider>
  );
};

export const useInterior = () => {
  const context = useContext(InteriorContext);
  if (!context) throw new Error("useInterior must be used inside InteriorProvider");
  return context;
};
