import React, { useRef, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
// import useDatabase from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { FieldDef } from 'pg';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Trash as TrashIcon,
  Play as PlayIcon,
  Share as ShareIcon,
} from '@phosphor-icons/react';
// import { LoadingIcon } from '@/components/icons';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { FileCsv, FileSql, FloppyDisk as FloppyDiskIcon, Folder, MicrosoftExcelLogo } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';



const QueryTool = () => {
  // const { query } = useDatabase();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [outputData, setOutputData] = useState<{ columns: { name: string, type: number }[]; rows: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [queryCompletionTime, setQueryCompletionTime] = useState<number | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // if (inputRef.current) {
    //   const currentInput = inputRef.current.value;
    //   try {
    //     const result = await query(currentInput);
    //     setQueryCompletionTime(result!.time);
    //     const columns = result!.output!.fields.map((field: FieldDef) => ({ name: field.name, type: field.dataTypeID }));

    //     const outputData = {
    //       columns: columns,
    //       rows: result!.output!.rows,
    //     };
    //     setOutputData(outputData);

    //   } catch (error) {
    //     setOutputData(null);
    //   }
    // }
    setIsLoading(false);
  };

  const handleExportCSV = () => {
    if (outputData) {
      const csvData = outputData.rows.map(row => {
        const rowData: { [key: string]: any } = {};
        outputData.columns.forEach(col => {
          rowData[col.name] = row[col.name];
        });
        return rowData;
      });

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'query_results.csv');
      link.click();
    } else {
      toast.error('No data to export');
    }
  };

  return (
    <div className="grid size-full">
    <ResizablePanelGroup direction="horizontal" className='size-full bg-background rounded-lg flex flex-col'>
      <ResizablePanel defaultSize={75}>
        <ResizablePanelGroup direction="vertical" className='size-full'>
          <ResizablePanel defaultSize={50} minSize={10} className='size-full '>
            <form onSubmit={handleSubmit} className='flex flex-col size-full'>
              <div className="flex justify-between gap-2 p-1 border-b">
                <div className="grid grid-flow-col gap-2 p-1">
                  <Input placeholder='Enter query name' type='text' className='shadow-none border-none outline-none' />
                </div>
                <div className="flex gap-1 p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled={isLoading}
                        size={'icon'}
                        className='flex'
                        type='reset'
                        onClick={() => {
                          setCode('');
                          setOutputData(null);
                        }}
                        variant={'ghost'}
                      >
                        <FloppyDiskIcon className='size-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size={'icon'} variant={'ghost'}>
                            <ShareIcon className='size-4' />
                            <p className="sr-only">Export</p>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Export output</p>
                        </TooltipContent>
                      </Tooltip>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleExportCSV}>
                        <FileCsv className='size-4 mr-2'/>
                        <p className='text-xs'>Export to CSV</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MicrosoftExcelLogo className='size-4 mr-2' />
                        <p className="text-xs">Export to Microsoft Excel</p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        disabled={isLoading}
                        size={'icon'}
                        className='flex'
                        type='submit'
                        variant={'ghost'}
                      >
                        {isLoading ? (
                          // <LoadingIcon className='size-5' />
                          <div className="dev size-4"></div>
                        ) : (
                          <PlayIcon className='size-4' />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Run query
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {/* <CodeEditor
                ref={inputRef}
                value={code}
                language="sql"
                minHeight={1}
                placeholder="select now()"
                onChange={(event: any) => setCode(event.target.value)}
                disabled={isLoading}
                className={`${isLoading && 'opacity-50'} bg-background overflow-scroll text-sm font-mono flex grow transition-all duration-300 ease-in-out resize-none text-pretty`}
              /> */}
              <textarea
                ref={inputRef}
                value={code}
                placeholder="select now()"
                onChange={(event) => setCode(event.target.value)}
                disabled={isLoading}
                className={`${isLoading && 'opacity-50'} focus:outline-none bg-background overflow-auto p-2 text-sm font-mono dark:text-primary flex grow transition-all duration-300 ease-in-out resize-none text-pretty`}
              />
            </form>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className='activehandle'
          />
          <ResizablePanel minSize={20} defaultSize={50}>
            <div className={`dark:bg-darkest bg-background overflow-auto h-[calc(100%-49px)]`}>
              {outputData ? (
                <table className='table-auto bg-primary-foreground w-fit h-fit text-left border-collapse transition-all duration-300 ease-in-out'>
                  <thead className='sticky top-[-1px] bg-primary-foreground drop-shadow max-h-[1rem] min-h-[1rem]'>
                    <tr className='truncate'>
                      {outputData.columns.map((col, index) => (
                        <th key={index} className='border border-t-none p-2 min-w-[10rem] w-[10rem] max-w-[10rem]'>
                          {col.name} <br /> <span className='text-xs text-foreground/70'>({col.type})</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outputData.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className='max-h-[1rem] min-h-[1rem] transition-all duration-300 ease-in-out'
                      >
                        {outputData.columns.map((col, colIndex) => (
                          <td
                            key={colIndex}
                            className='min-w-[10rem] w-[10rem] max-w-[10rem] truncate
                                      border hover:border-double hover:border-primary
                                      whitespace-nowrap p-2 hover:bg-secondary'
                          >
                            {row[col.name] instanceof Date ? row[col.name].toString() : row[col.name]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className='p-2 size-full flex text-foreground/70 items-center justify-center'>No data to display</p>
              )}
            </div>
          </ResizablePanel>
          <div className="border-t pb-px rounded-b flex text-xs w-full bg-background p-1 px-2 gap-2">
            <p>Num rows: {outputData?.rows.length}</p>
            <p>Num columns: {outputData?.columns.length}</p>
            <p>Query completed in {queryCompletionTime ? queryCompletionTime : '---'}ms</p>
          </div>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
    </div>
  );
};

export default QueryTool;
