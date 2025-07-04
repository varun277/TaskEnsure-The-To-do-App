import { CheckOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Dropdown, Tooltip } from "antd";
import styles from './Todo.module.css'
import { useEffect, useMemo } from "react";
import { STATUS_TYPE } from "../Constant/Constants";

const Header = ({ setModalOpen, queryFilter, setQueryFilter }) => {

    // Get URLSearchParams instance
    const params = new URLSearchParams(window.location.search);

    useEffect(() => {
        const filters = Object.fromEntries(params);
        const initialFilters = { ...filters, status: filters?.status?.split(',') || null }

        setQueryFilter(initialFilters)
    }, [])

    // Handle Add task button
    const handleButtonClick = () => {
        setModalOpen(true)
    };

    // Get the array of current status filters
    const currentStatusFilter = useMemo(() => {
        const statusParam = queryFilter.status;
        return statusParam || []
    }, [queryFilter?.status])

    // Handle dropdown click
    const handleDropdownItemClick = (e) => {
        const { key } = e;

        if (key.startsWith('status')) {
            const filterValue = key === "status_complete" ? STATUS_TYPE.COMPLETE : STATUS_TYPE.PENDING;

            let statusArray = [...currentStatusFilter]
            // Toggle the status value
            if (statusArray?.includes(filterValue)) {
                // Remove if already present
                statusArray = statusArray?.filter(status => status !== filterValue);
            } else {
                // Add if not present
                statusArray?.push(filterValue);
            }

            updateQueryParams({
                "status": statusArray
            })
        }
        else if (key.startsWith('date')) {
            const filterValue = key === "date_asc" ? "asc" : "desc"
            updateQueryParams({
                // Remove the date filter if filterValue === queryFilter date
                "date": queryFilter?.date === filterValue ? null : filterValue
            })
        }
    }

    const updateQueryParams = (newParams) => {
        // Add/update multiple parameters
        Object.entries(newParams)?.forEach(([key, value]) => {
            if (value === null || value === undefined || value === '' || !value?.length) {
                params.delete(key);
            } else {
                params.set(key, value.toString());
            }
        });

        // Fix: Add '?' prefix if there are parameters, otherwise use empty string
        const queryString = params.toString();
        const newUrl = queryString ? `?${queryString}` : window.location.pathname;
        window.history.replaceState({}, '', newUrl)

        // Update the local state
        setQueryFilter((prev) => ({ ...prev, ...newParams }))
    }

    const items = [
        {
            key: 'status',
            type: 'group',
            label: 'Filter by Status',
            children: [
                {
                    key: 'status_complete',
                    label: <Checkbox checked={currentStatusFilter?.includes(STATUS_TYPE.COMPLETE)}>Completed</Checkbox>
                },
                {
                    key: 'status_pending',
                    label: <Checkbox checked={currentStatusFilter?.includes(STATUS_TYPE.PENDING)}>Pending</Checkbox>
                }
            ],
        },
        {
            key: 'date',
            label: 'Filter by Due date ',
            children: [
                {
                    key: 'date_asc',
                    label: <div className={styles.dropdownItemStyle}
                        style={{
                            color: queryFilter?.date === 'asc' && "var(--selected_text)"
                        }}>
                        {queryFilter?.date === 'asc' && (<CheckOutlined />)}
                        Ascending
                    </div>,
                },
                {
                    key: 'date_desc',
                    label: <div className={styles.dropdownItemStyle}
                        style={{
                            color: queryFilter?.date === 'desc' && "var(--selected_text)"
                        }}>
                        {queryFilter?.date === 'desc' && (<CheckOutlined />)}
                        Descending
                    </div>,
                },

            ],
        }
    ];

    return (
        <div className={styles.header}>
            <div className={styles.title}>
                <h1 className={styles.firstTitle}>
                    Task
                    <span className={styles.secondTitle}>Ensure</span>
                </h1>
                <p className={styles.secondaryTitle}>Your Life, Perfectly Orchestrated</p>
            </div>
            <div className={styles.buttonWrapper}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleButtonClick}
                >
                    Add Task
                </Button>
                <Dropdown menu={{
                    onClick: handleDropdownItemClick,
                    items
                }}>
                    <a onClick={e => e.preventDefault()}>
                        <Tooltip title={"Filter by "}>
                            <Button type="default" style={{ padding: "10px" }}>
                                <FilterOutlined style={{ fontSize: "18px" }} />
                            </Button>
                        </Tooltip>
                    </a>
                </Dropdown>
            </div>
        </div>
    );
};

export default Header