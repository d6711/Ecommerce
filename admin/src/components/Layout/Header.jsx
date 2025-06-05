import { Avatar, Dropdown } from 'antd'
import { Input } from 'antd'
import styles from './styles.module.scss'
import { DownOutlined, UserOutlined } from '@ant-design/icons'

const { Search } = Input

const MyHeader = () => {
    const { containerHeader } = styles
    const items = [
        { label: 'My Profile', key: '/profile' },
        { label: 'Settings', key: '/settings' },
        { type: 'divider' },
        { label: 'Logout', key: 'logout' },
    ]

    return (
        <div className={containerHeader}>
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="middle"
                style={{ maxWidth: '300px' }}
            />
            <div>
                <Dropdown menu={{ items }} trigger={['click']}>
                    <a
                        onClick={(e) => e.preventDefault()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <Avatar size="small" icon={<UserOutlined />} />
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                            Username
                        </span>
                        <DownOutlined />
                    </a>
                </Dropdown>
            </div>
        </div>
    )
}

export default MyHeader
