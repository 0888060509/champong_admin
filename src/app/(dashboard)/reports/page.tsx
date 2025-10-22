

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Download, ArrowUpDown, X as XIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, ZAxis, LineChart, Line } from 'recharts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock Data
const allProductPerformanceData = [
  { name: 'Classic Burger', category: 'Main Course', quantity: 150, grossRevenue: 1948.50, discount: 50.00, netRevenue: 1898.50, cogs: 750, profit: 1148.50 },
  { name: 'Margherita Pizza', category: 'Main Course', quantity: 100, grossRevenue: 1500.00, discount: 20.00, netRevenue: 1480.00, cogs: 500, profit: 980.00 },
  { name: 'Caesar Salad', category: 'Appetizers', quantity: 200, grossRevenue: 1798.00, discount: 25.50, netRevenue: 1772.50, cogs: 600, profit: 1172.50 },
  { name: 'Bruschetta', category: 'Appetizers', quantity: 180, grossRevenue: 1440.00, discount: 15.00, netRevenue: 1425.00, cogs: 450, profit: 975.00 },
  { name: 'Chocolate Lava Cake', category: 'Desserts', quantity: 120, grossRevenue: 900.00, discount: 12.00, netRevenue: 888.00, cogs: 300, profit: 588.00 },
  { name: 'Tiramisu', category: 'Desserts', quantity: 90, grossRevenue: 720.00, discount: 10.00, netRevenue: 710.00, cogs: 270, profit: 440.00 },
  { name: 'Iced Tea', category: 'Drinks', quantity: 300, grossRevenue: 1050.00, discount: 0, netRevenue: 1050.00, cogs: 150, profit: 900.00 },
  { name: 'Espresso', category: 'Drinks', quantity: 250, grossRevenue: 750.00, discount: 5.00, netRevenue: 745.00, cogs: 125, profit: 620.00 },
];

type ProductPerformanceData = typeof allProductPerformanceData[0];
type SortKey = keyof ProductPerformanceData;

const revenueByCategoryData = [
    { name: 'Main Course', value: 45 },
    { name: 'Appetizers', value: 25 },
    { name: 'Desserts', value: 15 },
    { name: 'Drinks', value: 15 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const commonlyBoughtWithData = [
    { name: 'Fries', count: 120 },
    { name: 'Coke', count: 95 },
    { name: 'Onion Rings', count: 60 },
];

const branchPerformanceData = [
    { name: 'Main Street Cafe', netRevenue: 45231, totalOrders: 1234, aov: 36.65, avgRating: 4.8, onlineOfflineRatio: '60/40' },
    { name: 'Downtown Deli', netRevenue: 38765, totalOrders: 1102, aov: 35.18, avgRating: 4.6, onlineOfflineRatio: '75/25' },
    { name: 'Seaside Grill', netRevenue: 52109, totalOrders: 1450, aov: 35.94, avgRating: 4.9, onlineOfflineRatio: '50/50' },
];

const customerRatioData = [
    { name: 'New Customers', value: 35, fill: 'hsl(var(--chart-1))' },
    { name: 'Returning Customers', value: 65, fill: 'hsl(var(--chart-2))' },
];

const rfmSegmentsData = [
    { x: 4.5, y: 4.5, z: 150, name: 'Champions', customers: 42 },
    { x: 3.8, y: 4.2, z: 120, name: 'Loyal Customers', customers: 85 },
    { x: 2.1, y: 2.5, z: 200, name: 'Potential Loyalists', customers: 150 },
    { x: 4.8, y: 1.5, z: 80, name: 'New Customers', customers: 60 },
    { x: 1.5, y: 1.2, z: 300, name: 'Hibernating', customers: 210 },
    { x: 2.5, y: 1.8, z: 250, name: 'At Risk', customers: 180 },
];

const allTopCustomers = [
    { id: '1', name: 'Noah Williams', avatar: 'N', totalSpent: 2300.00, segment: 'Champions' },
    { id: '2', name: 'Liam Johnson', avatar: 'L', totalSpent: 1250.50, segment: 'Loyal Customers' },
    { id: '3', name: 'Sophia Loren', avatar: 'S', totalSpent: 1100.25, segment: 'Loyal Customers' },
    { id: '4', name: 'Olivia Smith', avatar: 'O', totalSpent: 850.75, segment: 'Potential Loyalists' },
    { id: '5', name: 'James Dean', avatar: 'J', totalSpent: 780.00, segment: 'Potential Loyalists' },
    { id: '6', name: 'Ava Miller', avatar: 'A', totalSpent: 250.00, segment: 'New Customers' },
    { id: '7', name: 'Mason Jones', avatar: 'M', totalSpent: 15.00, segment: 'At Risk' },
];


const rfmPerformanceData = [
    { segment: 'Champions', clients: 1, orders: 10, totalRevenue: 4250.5, avgRevenue: 425.05, avgRecency: 652.40, avgFrequency: 3.00, color: 'bg-yellow-300' },
    { segment: 'Loyal Customers', clients: 2, orders: 15, totalRevenue: 2350.75, avgRevenue: 156.72, avgRecency: 610.10, avgFrequency: 2.50, color: 'bg-green-400' },
    { segment: 'Potential Loyalists', clients: 18, orders: 129, totalRevenue: 46075.33, avgRevenue: 357.17, avgRecency: 604.36, avgFrequency: 2.12, color: 'bg-green-300' },
    { segment: 'New Customers', clients: 29, orders: 155, totalRevenue: 54078.16, avgRevenue: 348.89, avgRecency: 682.14, avgFrequency: 0.61, color: 'bg-green-200' },
    { segment: 'Promising', clients: 12, orders: 63, totalRevenue: 20319.98, avgRevenue: 322.54, avgRecency: 622.10, avgFrequency: 1.21, color: 'bg-blue-200' },
    { segment: 'Need attention', clients: 4, orders: 36, totalRevenue: 14096.16, avgRevenue: 391.56, avgRecency: 510.92, avgFrequency: 3.53, color: 'bg-orange-300' },
    { segment: 'About to sleep', clients: 11, orders: 75, totalRevenue: 24891.87, avgRevenue: 331.89, avgRecency: 577.53, avgFrequency: 1.89, color: 'bg-red-300' },
    { segment: 'Cannot lose them', clients: 10, orders: 99, totalRevenue: 36146.41, avgRevenue: 365.12, avgRecency: 428.27, avgFrequency: 5.45, color: 'bg-red-500 text-white' },
    { segment: 'At Risk', clients: 27, orders: 208, totalRevenue: 69808.42, avgRevenue: 335.62, avgRecency: 440.65, avgFrequency: 3.62, color: 'bg-red-400' },
    { segment: 'Lost', clients: 14, orders: 95, totalRevenue: 30976.29, avgRevenue: 326.07, avgRecency: 559.33, avgFrequency: 1.93, color: 'bg-gray-400 text-white' },
];

const customerTrendsData = [
    { month: 'Jan', newCustomers: 120, returningCustomers: 450, averageClv: 280 },
    { month: 'Feb', newCustomers: 150, returningCustomers: 480, averageClv: 285 },
    { month: 'Mar', newCustomers: 180, returningCustomers: 520, averageClv: 290 },
    { month: 'Apr', newCustomers: 160, returningCustomers: 510, averageClv: 295 },
    { month: 'May', newCustomers: 200, returningCustomers: 550, averageClv: 305 },
    { month: 'Jun', newCustomers: 210, returningCustomers: 580, averageClv: 310 },
];

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [productData, setProductData] = useState<ProductPerformanceData[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'profit', direction: 'descending' });
  const [isClient, setIsClient] = useState(false);

  const [selectedRfmSegment, setSelectedRfmSegment] = useState<string | null>(null);

  const rfmTotals = rfmPerformanceData.reduce((acc, curr) => ({
      clients: acc.clients + curr.clients,
      orders: acc.orders + curr.orders,
      totalRevenue: acc.totalRevenue + curr.totalRevenue,
  }), { clients: 0, orders: 0, totalRevenue: 0 });

  useEffect(() => {
    setIsClient(true);
    // Simulate initial data fetch
    setProductData(allProductPerformanceData.map(item => ({...item, quantity: item.quantity + Math.floor(Math.random() * 50) })));
  }, []);

  useEffect(() => {
    if (!isClient) return;
    // This is a simulation of data filtering.
    // In a real app, you would fetch new data based on `date` and `selectedBranch`.
    console.log(`Filtering data for branch: ${selectedBranch} and date range:`, date);
    // Just re-randomize data to show a change
    setProductData(allProductPerformanceData.map(item => ({...item, quantity: item.quantity + Math.floor(Math.random() * 50) })));
  }, [date, selectedBranch, isClient]);

  const filteredAndSortedProductData = useMemo(() => {
    let filteredData = selectedCategory
      ? productData.filter(p => p.category === selectedCategory)
      : productData;

    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredData;
  }, [productData, sortConfig, selectedCategory]);
  
  const topCustomersData = useMemo(() => {
    if (!selectedRfmSegment) {
        return allTopCustomers;
    }
    return allTopCustomers.filter(customer => customer.segment === selectedRfmSegment);
  }, [selectedRfmSegment]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'descending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };
  
  const getProfitCellStyle = (profit: number) => {
    const profits = filteredAndSortedProductData.map(p => p.profit);
    const maxProfit = Math.max(...profits);
    const minProfit = Math.min(...profits);
    const range = maxProfit - minProfit;
    if (range === 0) return '';
    
    const percentage = (profit - minProfit) / range;
    
    if (percentage > 0.8) return 'bg-green-200 dark:bg-green-900/50';
    if (percentage < 0.2) return 'bg-red-200 dark:bg-red-900/50';
    
    return '';
  }
  
  const handlePieClick = (data: any) => {
    const categoryName = data.name;
    setSelectedCategory(current => current === categoryName ? null : categoryName);
  };


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Performance Reports</CardTitle>
                        <CardDescription>In-depth analysis of your business performance.</CardDescription>
                    </div>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4"/>
                        Export Page
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className="w-[300px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        <SelectItem value="main-street">Main Street Cafe</SelectItem>
                        <SelectItem value="downtown-deli">Downtown Deli</SelectItem>
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>

        <Tabs defaultValue="product">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="product">Product Performance</TabsTrigger>
                <TabsTrigger value="branch">Branch Performance</TabsTrigger>
                <TabsTrigger value="customer">Customer Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="product" className="space-y-6 mt-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="font-headline">Revenue by Category</CardTitle>
                                {selectedCategory && (
                                    <CardDescription>
                                        Showing data for "{selectedCategory}". Click category again to clear.
                                    </CardDescription>
                                )}
                            </div>
                             {selectedCategory && (
                                <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                                    <XIcon className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={revenueByCategoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    onClick={handlePieClick}
                                >
                                    {revenueByCategoryData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]} 
                                            className="cursor-pointer"
                                            stroke={selectedCategory === entry.name ? 'hsl(var(--foreground))' : ''}
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value}%`, name]}/>
                                <Legend onClick={(data) => handlePieClick(data)}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-headline">Product Details</CardTitle>
                            {selectedCategory && <CardDescription>Showing products in the "{selectedCategory}" category.</CardDescription>}
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => requestSort('quantity')}>
                                                Qty Sold
                                                {sortConfig?.key === 'quantity' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => requestSort('netRevenue')}>
                                                Net Revenue
                                                {sortConfig?.key === 'netRevenue' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => requestSort('cogs')}>
                                                COGS
                                                {sortConfig?.key === 'cogs' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => requestSort('profit')}>
                                                Gross Profit
                                                {sortConfig?.key === 'profit' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                                            </Button>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAndSortedProductData.map((item) => (
                                    <TableRow key={item.name}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${item.netRevenue.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">${item.cogs.toFixed(2)}</TableCell>
                                        <TableCell className={cn("text-right font-medium", getProfitCellStyle(item.profit))}>${item.profit.toFixed(2)}</TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Market Basket Analysis</CardTitle>
                            <CardDescription>
                                {selectedCategory ? `Commonly bought with "${selectedCategory}" items.` : `Products commonly bought together.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={commonlyBoughtWithData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} />
                                    <Bar dataKey="count" fill="hsl(var(--primary))" barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
            <TabsContent value="branch" className="space-y-6 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Branch Comparison</CardTitle>
                        <CardDescription>Comparative analysis of key branch metrics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={branchPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="netRevenue" fill="hsl(var(--chart-1))" name="Net Revenue" />
                                <Bar yAxisId="right" dataKey="totalOrders" fill="hsl(var(--chart-2))" name="Total Orders" />
                                <Bar yAxisId="right" dataKey="aov" fill="hsl(var(--chart-3))" name="AOV" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Branch Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Branch</TableHead>
                                    <TableHead className="text-right">Net Revenue</TableHead>
                                    <TableHead className="text-right">Total Orders</TableHead>
                                    <TableHead className="text-right">AOV</TableHead>
                                    <TableHead className="text-right">Avg. Rating</TableHead>
                                    <TableHead className="text-right">Online/Offline Ratio</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branchPerformanceData.map((branch) => (
                                <TableRow key={branch.name}>
                                    <TableCell className="font-medium">{branch.name}</TableCell>
                                    <TableCell className="text-right">${branch.netRevenue.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{branch.totalOrders.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${branch.aov.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{branch.avgRating}</TableCell>
                                    <TableCell className="text-right">{branch.onlineOfflineRatio}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="customer" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Customer Mix</CardTitle>
                            <CardDescription>New vs. Returning</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie data={customerRatioData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} paddingAngle={5}>
                                        {customerRatioData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconSize={10} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                            <CardTitle className="font-headline text-lg">Avg. Purchase Frequency</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">2.4</p>
                            <p className="text-sm text-muted-foreground">times per month</p>
                        </CardContent>
                    </Card>
                     <Card>
                         <CardHeader>
                            <CardTitle className="font-headline text-lg">Estimated CLV</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">$287.50</p>
                            <p className="text-sm text-muted-foreground">per customer</p>
                        </CardContent>
                    </Card>
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="font-headline">RFM Customer Segmentation</CardTitle>
                            <CardDescription>Recency, Frequency & Monetary analysis.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={350}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid />
                                    <XAxis type="number" dataKey="x" name="Recency Score" label={{ value: 'Recency ->', position: 'insideBottom', offset: -10 }} />
                                    <YAxis type="number" dataKey="y" name="Frequency & Monetary Score" label={{ value: 'Freq & Monetary ->', angle: -90, position: 'insideLeft' }}/>
                                    <ZAxis type="number" dataKey="z" range={[100, 1000]} name="customers" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                                    <Legend formatter={(value, entry) => <span className="text-muted-foreground">{entry.payload?.name}</span>}/>
                                    <Scatter name="Segments" data={rfmSegmentsData} fill="hsl(var(--primary))" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <CardTitle className="font-headline">Top Spending Customers</CardTitle>
                                    {selectedRfmSegment && (
                                        <CardDescription>
                                            Showing customers in the "{selectedRfmSegment}" segment.
                                        </CardDescription>
                                    )}
                                </div>
                                {selectedRfmSegment && (
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedRfmSegment(null)}>
                                        <XIcon className="mr-2 h-4 w-4" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead className="text-right">Total Spent</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topCustomersData.map(customer => (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{customer.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{customer.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">${customer.totalSpent.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                 </div>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Overview of RFM Segments</CardTitle>
                        <CardDescription>Detailed performance metrics for each customer segment. Click a row to filter customers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Segments</TableHead>
                                    <TableHead className="text-right"># Clients</TableHead>
                                    <TableHead className="text-right"># Orders</TableHead>
                                    <TableHead className="text-right">Total Revenue</TableHead>
                                    <TableHead className="text-right">Avg Revenue</TableHead>
                                    <TableHead className="text-right">Avg Recency</TableHead>
                                    <TableHead className="text-right">Avg Frequency</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rfmPerformanceData.map((item) => (
                                    <TableRow 
                                        key={item.segment} 
                                        className={cn(
                                            "cursor-pointer",
                                            selectedRfmSegment === item.segment && "bg-muted/80"
                                        )}
                                        onClick={() => setSelectedRfmSegment(item.segment)}
                                    >
                                        <TableCell>
                                            <Badge className={cn('text-xs', item.color)}>{item.segment}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{item.clients}</TableCell>
                                        <TableCell className="text-right">{item.orders}</TableCell>
                                        <TableCell className="text-right">${item.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-right">${item.avgRevenue.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{item.avgRecency.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{item.avgFrequency.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell className="text-right font-bold">{rfmTotals.clients}</TableCell>
                                    <TableCell className="text-right font-bold">{rfmTotals.orders}</TableCell>
                                    <TableCell className="text-right font-bold">${rfmTotals.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                    <TableCell colSpan={3}></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Customer Trends Over Time</CardTitle>
                        <CardDescription>Monthly trends for key customer metrics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart
                                data={customerTrendsData}
                                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" label={{ value: 'Number of Customers', angle: -90, position: 'insideLeft' }} />
                                <YAxis yAxisId="right" orientation="right" label={{ value: 'Average CLV ($)', angle: 90, position: 'insideRight' }} />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="newCustomers" name="New Customers" stroke="hsl(var(--chart-2))" />
                                <Line yAxisId="left" type="monotone" dataKey="returningCustomers" name="Returning Customers" stroke="hsl(var(--chart-1))" />
                                <Line yAxisId="right" type="monotone" dataKey="averageClv" name="Average CLV" stroke="hsl(var(--chart-3))" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border shadow-sm rounded-lg p-3">
        <p className="font-bold text-lg">{data.name}</p>
        <p className="text-sm text-muted-foreground">{data.customers} customers</p>
      </div>
    );
  }
  return null;
};
