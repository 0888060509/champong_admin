
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Mock Data
const productPerformanceData = [
  { name: 'Classic Burger', category: 'Main Course', quantity: 150, grossRevenue: 1948.50, discount: 50.00, netRevenue: 1898.50, cogs: 750, profit: 1148.50 },
  { name: 'Caesar Salad', category: 'Appetizers', quantity: 200, grossRevenue: 1798.00, discount: 25.50, netRevenue: 1772.50, cogs: 600, profit: 1172.50 },
  { name: 'Chocolate Lava Cake', category: 'Desserts', quantity: 120, grossRevenue: 900.00, discount: 12.00, netRevenue: 888.00, cogs: 300, profit: 588.00 },
  { name: 'Iced Tea', category: 'Drinks', quantity: 300, grossRevenue: 1050.00, discount: 0, netRevenue: 1050.00, cogs: 150, profit: 900.00 },
];

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

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

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
                <Select defaultValue="all">
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
                        <CardTitle className="font-headline">Revenue by Category</CardTitle>
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
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {revenueByCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value}%`, name]}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-headline">Product Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Qty Sold</TableHead>
                                        <TableHead className="text-right">Net Revenue</TableHead>
                                        <TableHead className="text-right">COGS</TableHead>
                                        <TableHead className="text-right">Gross Profit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productPerformanceData.map((item) => (
                                    <TableRow key={item.name} className="cursor-pointer hover:bg-muted">
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${item.netRevenue.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">${item.cogs.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">${item.profit.toFixed(2)}</TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Market Basket Analysis</CardTitle>
                            <CardDescription>Products commonly bought with 'Classic Burger'.</CardDescription>
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
            <TabsContent value="customer">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Customer Analysis</CardTitle>
                        <CardDescription>Insights into customer segments and behavior.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Customer analysis reports will be displayed here.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
