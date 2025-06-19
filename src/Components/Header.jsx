import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Dropdown, Tooltip } from "antd";
import styles from './Todo.module.css'
import { useEffect, useState } from "react";

const Header = ({ setModalOpen }) => {
    // State to store all filters
    const [queryFilter, setQueryFilter] = useState({})
    // Get URLSearchParams instance
    const params = new URLSearchParams(window.location.search);

    useEffect(() => {
        const initialFilters = Object.fromEntries(params);
        setQueryFilter(initialFilters)
    }, [])

    // Handle Add task button
    const handleButtonClick = () => {
        setModalOpen(true)
    };

    // Handle dropdown click
    const handleDropdownItemClick = (e) => {
        const { key } = e;

        if (key.startsWith('status')) {
            const filterValue = key === "status_complete" ? "complete" : "pending";
            // If there is a status parameter in URL check the values are same , if same then remove the value, if not same then append
            const currentStatus = params?.get('status');

            let statusArray = currentStatus ? currentStatus.split(',') : [];
            // Toggle the status value
            if (statusArray?.includes(filterValue)) {
                // Remove if already present
                statusArray = statusArray?.filter(status => status !== filterValue);
            } else {
                // Add if not present
                statusArray?.push(filterValue);
            }

            updateQueryParams({
                "status": statusArray?.length > 0 ? statusArray.join(',') : null
            })
        }
        else if (key.startsWith('date')) {
            const filterValue = key === "date_asc" ? "asc" : "desc"
            updateQueryParams({
                "date": filterValue
            })
        }
    }

    const updateQueryParams = (newParams) => {
        const params = new URLSearchParams(window.location.search);

        // Add/update multiple parameters
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
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
                    label: <Checkbox value="Complete">Completed</Checkbox>
                },
                {
                    key: 'status_pending',
                    label: <Checkbox value="Pending">Pending</Checkbox>
                }
            ],
        },
        {
            key: 'date',
            label: 'Filter by Due date ',
            children: [
                {
                    key: 'date_asc',
                    label: 'Ascending',
                },
                {
                    key: 'date_desc',
                    label: 'Descending',
                },

            ],
        }
    ];

    return (
        <div className={styles.header}>
            <div className={styles.title}>
                <h1 style={{ fontSize: "30px", color: "#1677ff" }}>
                    Task
                    <span style={{ color: "#A1EEBD", fontSize: "30px" }}>Ensure</span>
                </h1>
                <p style={{ fontStyle: "italic" }}>Your Life, Perfectly Orchestrated</p>
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