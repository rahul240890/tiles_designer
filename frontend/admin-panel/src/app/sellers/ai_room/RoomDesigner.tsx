"use client";

import { useState, useRef } from "react";
import { Dialog, Drawer, Tabs, Tab, Box, Grid, Button, IconButton, Select, MenuItem, FormControl, InputLabel, Fab, Menu } from "@mui/material";
import { FaBed, FaThLarge, FaThList, FaPaintBrush, FaLightbulb, FaArrowUp, FaChevronLeft, FaHeart, FaTrash, FaTh, FaBars, FaEllipsisV } from "react-icons/fa";

const tabs = [
  { name: "Rooms", icon: <FaBed size={16} /> },
  { name: "Floor", icon: <FaThLarge size={16} /> },
  { name: "Wall", icon: <FaThList size={16} /> },
  { name: "Paint", icon: <FaPaintBrush size={16} /> },
  { name: "Light", icon: <FaLightbulb size={16} /> },
];

// Tile data
const tileData = [
  { name: "Tile 1", image: "/tiles/t1.jpg", size: "200x200", material: "Ceramic", color: "White" },
  { name: "Tile 2", image: "/tiles/t2.jpg", size: "400x400", material: "Porcelain", color: "Gray" },
  { name: "Tile 3", image: "/tiles/t3.jpg", size: "200x200", material: "Ceramic", color: "Black" },
  { name: "Tile 4", image: "/tiles/t4.jpg", size: "400x400", material: "Porcelain", color: "Beige" },
  { name: "Tile 5", image: "/tiles/t5.jpg", size: "200x200", material: "Ceramic", color: "Blue" },
];

// Utility functions
const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);
const generateItems = (items: any[], count: number) => {
  const shuffled = shuffleArray([...items]);
  return Array(count).fill(null).map((_, i) => shuffled[i % shuffled.length]);
};

// Predefined assets and colors
const roomImages = ["/rooms/r1.jpg", "/rooms/r2.jpg", "/rooms/r3.jpg", "/rooms/r4.jpg"];
const paintColors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD",
  "#D4A5A5", "#9B59B6", "#3498DB", "#E74C3C", "#2ECC71",
  "#F1C40F", "#E67E22", "#ECF0F1", "#BDC3C7", "#34495E",
  "#16A085", "#8E44AD", "#F39C12", "#D35400", "#7F8C8D"
];
const lightingOptions = ["Daylight", "Warm", "Cool", "Dim", "Bright"];

interface RoomDesignerProps {
  onClose: () => void;
}

export default function RoomDesigner({ onClose }: RoomDesignerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState([roomImages[Math.floor(Math.random() * roomImages.length)]]);
  const [availableRooms, setAvailableRooms] = useState(roomImages);
  const [layout, setLayout] = useState<"grid" | "list">("grid"); // Grid or List layout
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Filter and sorting states
  const [floorFilters, setFloorFilters] = useState({ size: "All", series: "All", material: "All", finish: "All", color: "All", sort: "Trending" });
  const [wallFilters, setWallFilters] = useState({ size: "All", series: "All", material: "All", finish: "All", color: "All", sort: "Trending" });

  const handleRoomSelect = (img: string) => {
    if (selectedRooms.includes(img) || selectedRooms.length >= 4) return;
    setSelectedRooms([...selectedRooms, img]);
    setAvailableRooms(availableRooms.filter((room) => room !== img));
  };

  const handleRoomDelete = (img: string) => {
    setSelectedRooms(selectedRooms.filter((room) => room !== img));
    setAvailableRooms([...availableRooms, img]);
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetFilters = (tab: number) => {
    if (tab === 1) setFloorFilters({ size: "All", series: "All", material: "All", finish: "All", color: "All", sort: "Trending" });
    if (tab === 2) setWallFilters({ size: "All", series: "All", material: "All", finish: "All", color: "All", sort: "Trending" });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <Dialog open={true} onClose={onClose} fullScreen PaperProps={{ sx: { m: 0, p: 0 } }}>
      <Box display="flex" height="100vh" sx={{ overflow: "hidden", bgcolor: "white" }}>
        {/* Left Sidebar (Fixed Tabs Column) */}
        <Box width={60} bgcolor="white" height="100%" display="flex" flexDirection="column" sx={{ borderRight: "2px solid #e0e0e0" }}>
          <Tabs
            orientation="vertical"
            value={activeTab}
            onChange={(e, newValue) => {
              setActiveTab(newValue);
              setIsContentVisible(true);
            }}
            sx={{ flexGrow: 1 }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.name} icon={tab.icon} label={tab.name} sx={{ minWidth: 60, fontSize: 12, padding: "8px", borderBottom: "1px solid #e0e0e0" }} />
            ))}
          </Tabs>
        </Box>

        {/* Sidebar Content (In Collapsible Drawer) */}
        <Box sx={{ width: isContentVisible ? 340 : 60, transition: "width 0.3s" }}>
          <Drawer
            variant="persistent"
            anchor="left"
            open={isContentVisible}
            sx={{
              width: 340,
              "& .MuiDrawer-paper": {
                width: 340,
                marginLeft: "60px",
                height: "100%",
                boxSizing: "border-box",
                borderRight: "2px solid #e0e0e0",
                bgcolor: "white",
              },
            }}
          >
            <Box height="100%" display="flex" flexDirection="column" p={1} bgcolor="white">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <h3 style={{ margin: 0 }}>{activeTab === 1 ? "Floor Filters" : activeTab === 2 ? "Wall Filters" : tabs[activeTab].name}</h3>
                <IconButton onClick={() => setIsContentVisible(false)}>
                  <FaChevronLeft />
                </IconButton>
              </Box>

              {/* Filters and Sorting for Floor and Wall Tabs */}
              {(activeTab === 1 || activeTab === 2) && (
                <Box mb={2}>
                  <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                    <InputLabel shrink>Sorted By</InputLabel>
                    <Select
                      value={activeTab === 1 ? floorFilters.sort : wallFilters.sort}
                      onChange={(e) => activeTab === 1 ? setFloorFilters({ ...floorFilters, sort: e.target.value }) : setWallFilters({ ...wallFilters, sort: e.target.value })}
                      notched
                    >
                      <MenuItem value="Trending">Trending</MenuItem>
                      <MenuItem value="Newest">Newest</MenuItem>
                    </Select>
                  </FormControl>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel shrink>Finish</InputLabel>
                        <Select value={activeTab === 1 ? floorFilters.finish : wallFilters.finish} onChange={(e) => activeTab === 1 ? setFloorFilters({ ...floorFilters, finish: e.target.value }) : setWallFilters({ ...wallFilters, finish: e.target.value })} notched>
                          <MenuItem value="All">All</MenuItem>
                          <MenuItem value="Glossy">Glossy</MenuItem>
                          <MenuItem value="Matte">Matte</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel shrink>Series</InputLabel>
                        <Select value={activeTab === 1 ? floorFilters.series : wallFilters.series} onChange={(e) => activeTab === 1 ? setFloorFilters({ ...floorFilters, series: e.target.value }) : setWallFilters({ ...wallFilters, series: e.target.value })} notched>
                          <MenuItem value="All">All</MenuItem>
                          <MenuItem value="Classic">Classic</MenuItem>
                          <MenuItem value="Modern">Modern</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel shrink>Material</InputLabel>
                        <Select value={activeTab === 1 ? floorFilters.material : wallFilters.material} onChange={(e) => activeTab === 1 ? setFloorFilters({ ...floorFilters, material: e.target.value }) : setWallFilters({ ...wallFilters, material: e.target.value })} notched>
                          <MenuItem value="All">All</MenuItem>
                          <MenuItem value="Ceramic">Ceramic</MenuItem>
                          <MenuItem value="Porcelain">Porcelain</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel shrink>Color</InputLabel>
                        <Select value={activeTab === 1 ? floorFilters.color : wallFilters.color} onChange={(e) => activeTab === 1 ? setFloorFilters({ ...floorFilters, color: e.target.value }) : setWallFilters({ ...wallFilters, color: e.target.value })} notched>
                          <MenuItem value="All">All</MenuItem>
                          <MenuItem value="White">White</MenuItem>
                          <MenuItem value="Gray">Gray</MenuItem>
                          <MenuItem value="Black">Black</MenuItem>
                          <MenuItem value="Beige">Beige</MenuItem>
                          <MenuItem value="Blue">Blue</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel shrink>Sizes</InputLabel>
                        <Select value={activeTab === 1 ? floorFilters.size : wallFilters.size} onChange={(e) => activeTab === 1 ? setFloorFilters({ ...floorFilters, size: e.target.value }) : setWallFilters({ ...wallFilters, size: e.target.value })} notched>
                          <MenuItem value="All">All</MenuItem>
                          <MenuItem value="200x200">200x200</MenuItem>
                          <MenuItem value="400x400">400x400</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Button fullWidth variant="outlined" onClick={() => resetFilters(activeTab)} sx={{ border: "2px solid #e0e0e0", bgcolor: "white", flex: 1 }}>Reset Filters</Button>
                    <IconButton onClick={() => setLayout("grid")} sx={{ ml: 1, bgcolor: layout === "grid" ? "#e0e0e0" : "white" }}>
                      <FaTh />
                    </IconButton>
                    <IconButton onClick={() => setLayout("list")} sx={{ ml: 1, bgcolor: layout === "list" ? "#e0e0e0" : "white" }}>
                      <FaBars />
                    </IconButton>
                  </Box>
                </Box>
              )}

              {/* Tab Content Section */}
              <Box ref={contentRef} sx={{ flexGrow: 1, overflowY: "auto", scrollbarWidth: "thin", "&::-webkit-scrollbar": { width: "4px" }, "&::-webkit-scrollbar-thumb": { background: "#bdbdbd" } }}>
                {(activeTab === 1 || activeTab === 2) && layout === "grid" && (
                  <Grid container spacing={2}>
                    {generateItems(tileData, 20).map((tile, i) => (
                      <Grid item xs={4} key={i}>
                        <Box position="relative">
                          <Box component="img" src={tile.image} sx={{ width: "100%", aspectRatio: "1/1", objectFit: "contain", border: "3px solid #bdbdbd" }} />
                          <IconButton sx={{ position: "absolute", top: 2, right: 2, bgcolor: "white", padding: "4px", "&:hover": { bgcolor: "#f5f5f5" } }}>
                            <FaHeart size={14} color="#ef5350" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
                {(activeTab === 1 || activeTab === 2) && layout === "list" && (
                  <Box>
                    {generateItems(tileData, 20).map((tile, i) => (
                      <Box key={i} display="flex" alignItems="center" mb={2} p={1} border="3px solid #bdbdbd" bgcolor="white">
                        <Box component="img" src={tile.image} sx={{ width: "100px", height: "100px", objectFit: "contain", mr: 2 }} />
                        <Box>
                          <p style={{ margin: 0, fontWeight: "bold" }}>{tile.name}</p>
                          <p style={{ margin: 0 }}>Size: {tile.size}</p>
                          <p style={{ margin: 0 }}>Material: {tile.material}</p>
                          <p style={{ margin: 0 }}>Color: {tile.color}</p>
                        </Box>
                        <IconButton sx={{ position: "absolute", top: 2, right: 2, bgcolor: "white", padding: "4px", "&:hover": { bgcolor: "#f5f5f5" } }}>
                          <FaHeart size={14} color="#ef5350" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
                {activeTab === 0 && (
                  <Grid container spacing={2}>
                    {generateItems(availableRooms, 15).map((img, i) => (
                      <Grid item xs={12} key={i}>
                        <Box component="img" src={img} onClick={() => handleRoomSelect(img)} sx={{ width: "100%", objectFit: "contain", border: "3px solid #bdbdbd", cursor: "pointer" }} />
                      </Grid>
                    ))}
                  </Grid>
                )}
                {activeTab === 3 && (
                  <Grid container spacing={2}>
                    {generateItems(paintColors, 20).map((color, i) => (
                      <Grid item xs={4} key={i}>
                        <Box sx={{ aspectRatio: "1/1", bgcolor: color, border: "3px solid #bdbdbd" }} />
                      </Grid>
                    ))}
                  </Grid>
                )}
                {activeTab === 4 && (
                  <Grid container spacing={2}>
                    {generateItems(lightingOptions, 5).map((light, i) => (
                      <Grid item xs={4} key={i}>
                        <Button fullWidth variant="outlined" sx={{ border: "2px solid #bdbdbd", bgcolor: "white" }}>{light}</Button>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>

              {/* Scroll to Top Button */}
              <Button
                fullWidth
                variant="outlined"
                onClick={scrollToTop}
                sx={{ mt: 2, border: "2px solid #e0e0e0", bgcolor: "white", color: "#424242", "&:hover": { bgcolor: "#f5f5f5" } }}
              >
                <FaArrowUp style={{ marginRight: 8 }} /> Scroll on Top
              </Button>
            </Box>
          </Drawer>
        </Box>

        {/* Main Content - Selected Room Images */}
        <Box
          flex={1}
          p={2}
          bgcolor="white"
          sx={{
            width: isContentVisible ? "calc(100% - 400px)" : "100%",
            transition: "width 0.3s",
            borderLeft: "2px solid #e0e0e0",
            border: "2px solid #e0e0e0",
            position: "relative",
          }}
        >
          <Grid container spacing={2} sx={{ height: "100%" }}>
            {selectedRooms.map((img, index) => (
              <Grid
                item
                xs={selectedRooms.length === 1 ? 12 : selectedRooms.length === 2 ? 6 : 6}
                key={index}
                sx={{ position: "relative", height: selectedRooms.length > 2 ? "50%" : "100%" }}
              >
                <Box
                  component="img"
                  src={img}
                  sx={{
                    width: "100%",
                    height: "100%",
                    border: "3px solid #bdbdbd",
                  }}
                />
                <IconButton
                  onClick={() => handleRoomDelete(img)}
                  sx={{ position: "absolute", top: 4, right: 4, bgcolor: "white", "&:hover": { bgcolor: "#f5f5f5" } }}
                >
                  <FaTrash size={14} color="#ef5350" />
                </IconButton>
              </Grid>
            ))}
          </Grid>
          {/* Floating Options Button */}
          <Fab color="primary" onClick={handleMenuOpen} sx={{ position: "absolute", top: 16, right: 16 }}>
            <FaEllipsisV />
          </Fab>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Share</MenuItem>
            <MenuItem onClick={handleMenuClose}>Download</MenuItem>
            <MenuItem onClick={handleMenuClose}>Save</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); onClose(); }}>Exit</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Dialog>
  );
}
